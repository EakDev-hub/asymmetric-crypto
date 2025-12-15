import crypto from 'crypto';

/**
 * Generate ECC key pair with specified curve
 */
export const generateECCKeys = (algorithm, res) => {
  try {
    const curveMap = {
      'P-256': 'prime256v1',
      'P-384': 'secp384r1',
      'P-521': 'secp521r1',
      'secp256k1': 'secp256k1'
    };

    const namedCurve = curveMap[algorithm];

    if (!namedCurve) {
      return res.status(400).json({
        success: false,
        error: 'Invalid ECC algorithm',
        message: 'Supported ECC algorithms: P-256, P-384, P-521, secp256k1'
      });
    }

    const { publicKey, privateKey } = crypto.generateKeyPairSync('ec', {
      namedCurve,
      publicKeyEncoding: {
        type: 'spki',
        format: 'pem'
      },
      privateKeyEncoding: {
        type: 'pkcs8',
        format: 'pem'
      }
    });

    const keySizeMap = {
      'P-256': 256,
      'P-384': 384,
      'P-521': 521,
      'secp256k1': 256
    };

    return res.json({
      success: true,
      algorithm,
      curve: namedCurve,
      publicKey,
      privateKey,
      keySize: keySizeMap[algorithm],
      capabilities: ['sign', 'verify', 'ecdh']
    });
  } catch (error) {
    console.error('ECC key generation error:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to generate ECC key pair',
      message: error.message
    });
  }
};

/**
 * Sign message using ECDSA
 */
export const signWithECDSA = (algorithm, message, privateKey, res) => {
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

    // Determine hash algorithm based on curve
    const hashMap = {
      'P-256': 'SHA256',
      'P-384': 'SHA384',
      'P-521': 'SHA512',
      'secp256k1': 'SHA256'
    };

    const hashAlgorithm = hashMap[algorithm] || 'SHA256';

    // Create signature
    const sign = crypto.createSign(hashAlgorithm);
    sign.update(message);
    sign.end();

    const signature = sign.sign(privateKey);
    const signatureBase64 = signature.toString('base64');

    const curveMap = {
      'P-256': 'prime256v1',
      'P-384': 'secp384r1',
      'P-521': 'secp521r1',
      'secp256k1': 'secp256k1'
    };

    return res.json({
      success: true,
      signature: signatureBase64,
      algorithm: `ECDSA-${hashAlgorithm}`,
      curve: curveMap[algorithm],
      hash: hashAlgorithm
    });
  } catch (error) {
    console.error('ECDSA signing error:', error);
    return res.status(500).json({
      success: false,
      error: 'Signing failed',
      message: error.message
    });
  }
};

/**
 * Verify ECDSA signature
 */
export const verifyWithECDSA = (algorithm, message, signature, publicKey, res) => {
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

    // Determine hash algorithm based on curve
    const hashMap = {
      'P-256': 'SHA256',
      'P-384': 'SHA384',
      'P-521': 'SHA512',
      'secp256k1': 'SHA256'
    };

    const hashAlgorithm = hashMap[algorithm] || 'SHA256';

    // Convert signature from Base64
    const signatureBuffer = Buffer.from(signature, 'base64');

    // Verify signature
    const verify = crypto.createVerify(hashAlgorithm);
    verify.update(message);
    verify.end();

    const isValid = verify.verify(publicKey, signatureBuffer);

    return res.json({
      success: true,
      verified: isValid,
      algorithm: `ECDSA-${hashAlgorithm}`,
      hash: hashAlgorithm
    });
  } catch (error) {
    console.error('ECDSA verification error:', error);
    return res.status(500).json({
      success: false,
      error: 'Verification failed',
      message: error.message
    });
  }
};

/**
 * Perform ECDH key exchange
 */
export const performECDH = (algorithm, privateKey, peerPublicKey, res) => {
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

    // Perform ECDH key derivation using diffieHellman
    const sharedSecret = crypto.diffieHellman({
      privateKey: privateKeyObject,
      publicKey: publicKeyObject
    });

    const curveMap = {
      'P-256': 'prime256v1',
      'P-384': 'secp384r1',
      'P-521': 'secp521r1',
      'secp256k1': 'secp256k1'
    };

    return res.json({
      success: true,
      sharedSecret: sharedSecret.toString('base64'),
      algorithm: 'ECDH',
      curve: curveMap[algorithm],
      length: sharedSecret.length
    });
  } catch (error) {
    console.error('ECDH key exchange error:', error);
    return res.status(500).json({
      success: false,
      error: 'Key exchange failed',
      message: error.message.includes('invalid key')
        ? 'Invalid keys or mismatched curves. Ensure both keys use the same curve.'
        : error.message
    });
  }
};

export default {
  generateECCKeys,
  signWithECDSA,
  verifyWithECDSA,
  performECDH
};
