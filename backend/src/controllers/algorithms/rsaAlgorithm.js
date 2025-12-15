import crypto from 'crypto';

/**
 * Generate RSA key pair with specified key size
 */
export const generateRSAKeys = (algorithm, res) => {
  try {
    const keySizeMap = {
      'RSA-2048': 2048,
      'RSA-3072': 3072,
      'RSA-4096': 4096
    };

    const modulusLength = keySizeMap[algorithm];
    
    if (!modulusLength) {
      return res.status(400).json({
        success: false,
        error: 'Invalid RSA algorithm',
        message: 'Supported RSA algorithms: RSA-2048, RSA-3072, RSA-4096'
      });
    }

    const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
      modulusLength,
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
      algorithm,
      publicKey,
      privateKey,
      keySize: modulusLength,
      capabilities: ['encrypt', 'decrypt', 'sign', 'verify']
    });
  } catch (error) {
    console.error('RSA key generation error:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to generate RSA key pair',
      message: error.message
    });
  }
};

/**
 * Encrypt message using RSA public key
 */
export const encryptWithRSA = (message, publicKey, res) => {
  try {
    // Validate inputs
    if (!message || !publicKey) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields',
        message: 'Both message and publicKey are required'
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

    // Convert message to buffer
    const messageBuffer = Buffer.from(message, 'utf8');

    // Encrypt using RSA-OAEP
    const encrypted = crypto.publicEncrypt(
      {
        key: publicKey,
        padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
        oaepHash: 'sha256'
      },
      messageBuffer
    );

    // Convert to Base64 for easy transmission
    const encryptedBase64 = encrypted.toString('base64');

    return res.json({
      success: true,
      encrypted: encryptedBase64,
      algorithm: 'RSA-OAEP',
      padding: 'OAEP',
      hash: 'SHA-256'
    });
  } catch (error) {
    console.error('RSA encryption error:', error);
    return res.status(500).json({
      success: false,
      error: 'Encryption failed',
      message: error.message.includes('data too large')
        ? 'Message is too long for RSA key (max ~245 bytes for 2048-bit, ~381 for 3072-bit, ~501 for 4096-bit)'
        : error.message
    });
  }
};

/**
 * Decrypt message using RSA private key
 */
export const decryptWithRSA = (encryptedData, privateKey, res) => {
  try {
    // Validate inputs
    if (!encryptedData || !privateKey) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields',
        message: 'Both encryptedData and privateKey are required'
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

    // Convert Base64 to buffer
    const encryptedBuffer = Buffer.from(encryptedData, 'base64');

    // Decrypt using RSA-OAEP
    const decrypted = crypto.privateDecrypt(
      {
        key: privateKey,
        padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
        oaepHash: 'sha256'
      },
      encryptedBuffer
    );

    // Convert buffer back to string
    const decryptedMessage = decrypted.toString('utf8');

    return res.json({
      success: true,
      decrypted: decryptedMessage,
      algorithm: 'RSA-OAEP'
    });
  } catch (error) {
    console.error('RSA decryption error:', error);
    return res.status(500).json({
      success: false,
      error: 'Decryption failed',
      message: error.message.includes('error:')
        ? 'Invalid private key or corrupted encrypted data'
        : error.message
    });
  }
};

/**
 * Sign message using RSA private key
 */
export const signWithRSA = (message, privateKey, res) => {
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

    // Create signature using RSA-PSS (more secure than PKCS1)
    const sign = crypto.createSign('SHA256');
    sign.update(message);
    sign.end();

    const signature = sign.sign(privateKey);
    const signatureBase64 = signature.toString('base64');

    return res.json({
      success: true,
      signature: signatureBase64,
      algorithm: 'RSA-SHA256',
      hash: 'SHA-256'
    });
  } catch (error) {
    console.error('RSA signing error:', error);
    return res.status(500).json({
      success: false,
      error: 'Signing failed',
      message: error.message
    });
  }
};

/**
 * Verify RSA signature
 */
export const verifyWithRSA = (message, signature, publicKey, res) => {
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
    const verify = crypto.createVerify('SHA256');
    verify.update(message);
    verify.end();

    const isValid = verify.verify(publicKey, signatureBuffer);

    return res.json({
      success: true,
      verified: isValid,
      algorithm: 'RSA-SHA256',
      hash: 'SHA-256'
    });
  } catch (error) {
    console.error('RSA verification error:', error);
    return res.status(500).json({
      success: false,
      error: 'Verification failed',
      message: error.message
    });
  }
};

export default {
  generateRSAKeys,
  encryptWithRSA,
  decryptWithRSA,
  signWithRSA,
  verifyWithRSA
};
