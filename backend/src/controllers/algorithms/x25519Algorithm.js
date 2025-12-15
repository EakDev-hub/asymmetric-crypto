import crypto from 'crypto';

/**
 * Generate X25519 key pair (for ECDH key exchange only)
 */
export const generateX25519Keys = (res) => {
  try {
    const { publicKey, privateKey } = crypto.generateKeyPairSync('x25519', {
      publicKeyEncoding: {
        type: 'spki',
        format: 'pem'
      },
      privateKeyEncoding: {
        type: 'pkcs8',
        format: 'pem'
      }
    });

    return res.json({
      success: true,
      algorithm: 'X25519',
      publicKey,
      privateKey,
      keySize: 256,
      capabilities: ['ecdh']
    });
  } catch (error) {
    console.error('X25519 key generation error:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to generate X25519 key pair',
      message: error.message
    });
  }
};

/**
 * Perform X25519 key exchange (ECDH)
 */
export const performX25519KeyExchange = (privateKey, peerPublicKey, res) => {
  try {
    // Validate inputs
    if (!privateKey || !peerPublicKey) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields',
        message: 'Both privateKey and peerPublicKey are required'
      });
    }

    // Validate key formats
    if (!privateKey.includes('BEGIN PRIVATE KEY')) {
      return res.status(400).json({
        success: false,
        error: 'Invalid private key format',
        message: 'Private key must be in PEM format'
      });
    }

    if (!peerPublicKey.includes('BEGIN PUBLIC KEY')) {
      return res.status(400).json({
        success: false,
        error: 'Invalid peer public key format',
        message: 'Peer public key must be in PEM format'
      });
    }

    // Create key objects
    const privateKeyObject = crypto.createPrivateKey(privateKey);
    const publicKeyObject = crypto.createPublicKey(peerPublicKey);

    // Perform X25519 key derivation using diffieHellman
    const sharedSecret = crypto.diffieHellman({
      privateKey: privateKeyObject,
      publicKey: publicKeyObject
    });

    return res.json({
      success: true,
      sharedSecret: sharedSecret.toString('base64'),
      algorithm: 'X25519-ECDH',
      curve: 'Curve25519',
      length: sharedSecret.length,
      note: 'This shared secret can be used as a symmetric key for AES encryption'
    });
  } catch (error) {
    console.error('X25519 key exchange error:', error);
    return res.status(500).json({
      success: false,
      error: 'Key exchange failed',
      message: error.message.includes('invalid key')
        ? 'Invalid keys. Ensure both keys are X25519 keys.'
        : error.message
    });
  }
};

export default {
  generateX25519Keys,
  performX25519KeyExchange
};
