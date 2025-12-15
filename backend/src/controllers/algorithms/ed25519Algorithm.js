import crypto from 'crypto';

/**
 * Generate Ed25519 key pair (EdDSA - Edwards-curve Digital Signature Algorithm)
 */
export const generateEd25519Keys = (res) => {
  try {
    const { publicKey, privateKey } = crypto.generateKeyPairSync('ed25519', {
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
      algorithm: 'Ed25519',
      publicKey,
      privateKey,
      keySize: 256,
      capabilities: ['sign', 'verify']
    });
  } catch (error) {
    console.error('Ed25519 key generation error:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to generate Ed25519 key pair',
      message: error.message
    });
  }
};

/**
 * Sign message using Ed25519 (EdDSA)
 */
export const signWithEd25519 = (message, privateKey, res) => {
  try {
    // Validate inputs
    if (!message || !privateKey) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields',
        message: 'Both message and privateKey are required'
      });
    }

    // Validate private key format
    if (!privateKey.includes('BEGIN PRIVATE KEY')) {
      return res.status(400).json({
        success: false,
        error: 'Invalid private key format',
        message: 'Private key must be in PEM format'
      });
    }

    // Ed25519 uses its own internal hashing (SHA-512), no need to specify
    const signature = crypto.sign(null, Buffer.from(message, 'utf8'), {
      key: privateKey,
      format: 'pem'
    });

    const signatureBase64 = signature.toString('base64');

    return res.json({
      success: true,
      signature: signatureBase64,
      algorithm: 'EdDSA',
      hash: 'SHA-512',
      note: 'Ed25519 uses SHA-512 internally and provides deterministic signatures'
    });
  } catch (error) {
    console.error('Ed25519 signing error:', error);
    return res.status(500).json({
      success: false,
      error: 'Signing failed',
      message: error.message
    });
  }
};

/**
 * Verify Ed25519 signature
 */
export const verifyWithEd25519 = (message, signature, publicKey, res) => {
  try {
    // Validate inputs
    if (!message || !signature || !publicKey) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields',
        message: 'message, signature, and publicKey are all required'
      });
    }

    // Validate public key format
    if (!publicKey.includes('BEGIN PUBLIC KEY')) {
      return res.status(400).json({
        success: false,
        error: 'Invalid public key format',
        message: 'Public key must be in PEM format'
      });
    }

    // Convert signature from Base64
    const signatureBuffer = Buffer.from(signature, 'base64');

    // Verify signature
    const isValid = crypto.verify(
      null,
      Buffer.from(message, 'utf8'),
      {
        key: publicKey,
        format: 'pem'
      },
      signatureBuffer
    );

    return res.json({
      success: true,
      verified: isValid,
      algorithm: 'EdDSA',
      hash: 'SHA-512'
    });
  } catch (error) {
    console.error('Ed25519 verification error:', error);
    return res.status(500).json({
      success: false,
      error: 'Verification failed',
      message: error.message
    });
  }
};

export default {
  generateEd25519Keys,
  signWithEd25519,
  verifyWithEd25519
};
