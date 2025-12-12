import crypto from 'crypto';

/**
 * Generate RSA key pair (2048-bit)
 */
export const generateKeyPair = async (req, res) => {
  try {
    const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
      modulusLength: 2048,
      publicKeyEncoding: {
        type: 'spki',
        format: 'pem'
      },
      privateKeyEncoding: {
        type: 'pkcs8',
        format: 'pem'
      }
    });

    res.json({
      success: true,
      publicKey,
      privateKey,
      keySize: 2048,
      algorithm: 'RSA'
    });
  } catch (error) {
    console.error('Key generation error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to generate key pair',
      message: error.message
    });
  }
};

/**
 * Encrypt message using public key
 */
export const encryptMessage = async (req, res) => {
  try {
    const { message, publicKey } = req.body;

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

    res.json({
      success: true,
      encrypted: encryptedBase64,
      algorithm: 'RSA-OAEP',
      padding: 'OAEP',
      hash: 'SHA-256'
    });
  } catch (error) {
    console.error('Encryption error:', error);
    res.status(500).json({
      success: false,
      error: 'Encryption failed',
      message: error.message.includes('data too large') 
        ? 'Message is too long for 2048-bit RSA key (max ~245 bytes)'
        : error.message
    });
  }
};

/**
 * Decrypt message using private key
 */
export const decryptMessage = async (req, res) => {
  try {
    const { encryptedData, privateKey } = req.body;

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

    res.json({
      success: true,
      decrypted: decryptedMessage,
      algorithm: 'RSA-OAEP'
    });
  } catch (error) {
    console.error('Decryption error:', error);
    res.status(500).json({
      success: false,
      error: 'Decryption failed',
      message: error.message.includes('error:')
        ? 'Invalid private key or corrupted encrypted data'
        : error.message
    });
  }
};

/**
 * Sign message using private key
 */
export const signMessage = async (req, res) => {
  try {
    const { message, privateKey } = req.body;

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

    // Create signature
    const sign = crypto.createSign('SHA256');
    sign.update(message);
    sign.end();

    const signature = sign.sign(privateKey);
    const signatureBase64 = signature.toString('base64');

    res.json({
      success: true,
      signature: signatureBase64,
      algorithm: 'RSA-SHA256',
      hash: 'SHA-256'
    });
  } catch (error) {
    console.error('Signing error:', error);
    res.status(500).json({
      success: false,
      error: 'Signing failed',
      message: error.message
    });
  }
};

/**
 * Verify signature using public key
 */
export const verifySignature = async (req, res) => {
  try {
    const { message, signature, publicKey } = req.body;

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

    res.json({
      success: true,
      verified: isValid,
      algorithm: 'RSA-SHA256',
      hash: 'SHA-256'
    });
  } catch (error) {
    console.error('Verification error:', error);
    res.status(500).json({
      success: false,
      error: 'Verification failed',
      message: error.message
    });
  }
};
