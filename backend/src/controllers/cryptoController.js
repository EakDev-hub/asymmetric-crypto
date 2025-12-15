import crypto from 'crypto';
import { generateRSAKeys, encryptWithRSA, decryptWithRSA, signWithRSA, verifyWithRSA } from './algorithms/rsaAlgorithm.js';
import { generateECCKeys, signWithECDSA, verifyWithECDSA, performECDH } from './algorithms/eccAlgorithm.js';
import { generateEd25519Keys, signWithEd25519, verifyWithEd25519 } from './algorithms/ed25519Algorithm.js';
import { generateX25519Keys, performX25519KeyExchange } from './algorithms/x25519Algorithm.js';
import { canEncrypt, canSign, canKeyExchange, validateOperation } from '../utils/algorithmValidator.js';

/**
 * Generate key pair based on selected algorithm
 */
export const generateKeyPair = async (req, res) => {
  try {
    const { algorithm = 'RSA-2048' } = req.body;

    // Route to appropriate key generation function based on algorithm
    if (algorithm.startsWith('RSA')) {
      return generateRSAKeys(algorithm, res);
    } else if (['P-256', 'P-384', 'P-521', 'secp256k1'].includes(algorithm)) {
      return generateECCKeys(algorithm, res);
    } else if (algorithm === 'Ed25519') {
      return generateEd25519Keys(res);
    } else if (algorithm === 'X25519') {
      return generateX25519Keys(res);
    } else {
      return res.status(400).json({
        success: false,
        error: 'Unsupported algorithm',
        message: `Algorithm '${algorithm}' is not supported. Supported algorithms: RSA-2048, RSA-3072, RSA-4096, P-256, P-384, P-521, secp256k1, Ed25519, X25519`
      });
    }
  } catch (error) {
    console.error('Key generation error:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to generate key pair',
      message: error.message
    });
  }
};

/**
 * Encrypt message using public key (RSA only)
 */
export const encryptMessage = async (req, res) => {
  try {
    const { message, publicKey, algorithm = 'RSA-2048' } = req.body;

    // Check if algorithm supports encryption
    if (!canEncrypt(algorithm)) {
      return res.status(400).json({
        success: false,
        error: 'Algorithm does not support encryption',
        message: `${algorithm} does not support direct encryption. Only RSA algorithms support encryption. For ECC, use ECDH key exchange to derive a shared secret for AES encryption.`
      });
    }

    // Route to RSA encryption
    return encryptWithRSA(message, publicKey, res);
  } catch (error) {
    console.error('Encryption error:', error);
    return res.status(500).json({
      success: false,
      error: 'Encryption failed',
      message: error.message
    });
  }
};

/**
 * Decrypt message using private key (RSA only)
 */
export const decryptMessage = async (req, res) => {
  try {
    const { encryptedData, privateKey, algorithm = 'RSA-2048' } = req.body;

    // Check if algorithm supports decryption
    if (!canEncrypt(algorithm)) {
      return res.status(400).json({
        success: false,
        error: 'Algorithm does not support decryption',
        message: `${algorithm} does not support direct decryption. Only RSA algorithms support decryption.`
      });
    }

    // Route to RSA decryption
    return decryptWithRSA(encryptedData, privateKey, res);
  } catch (error) {
    console.error('Decryption error:', error);
    return res.status(500).json({
      success: false,
      error: 'Decryption failed',
      message: error.message
    });
  }
};

/**
 * Sign message using private key
 */
export const signMessage = async (req, res) => {
  try {
    const { message, privateKey, algorithm = 'RSA-2048' } = req.body;

    // Check if algorithm supports signing
    if (!canSign(algorithm)) {
      return res.status(400).json({
        success: false,
        error: 'Algorithm does not support signing',
        message: `${algorithm} does not support digital signatures.`
      });
    }

    // Route to appropriate signing function based on algorithm
    if (algorithm.startsWith('RSA')) {
      return signWithRSA(message, privateKey, res);
    } else if (['P-256', 'P-384', 'P-521', 'secp256k1'].includes(algorithm)) {
      return signWithECDSA(algorithm, message, privateKey, res);
    } else if (algorithm === 'Ed25519') {
      return signWithEd25519(message, privateKey, res);
    } else {
      return res.status(400).json({
        success: false,
        error: 'Unsupported signing algorithm',
        message: `Algorithm '${algorithm}' is not supported for signing.`
      });
    }
  } catch (error) {
    console.error('Signing error:', error);
    return res.status(500).json({
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
    const { message, signature, publicKey, algorithm = 'RSA-2048' } = req.body;

    // Check if algorithm supports signature verification
    if (!canSign(algorithm)) {
      return res.status(400).json({
        success: false,
        error: 'Algorithm does not support signature verification',
        message: `${algorithm} does not support signature verification.`
      });
    }

    // Route to appropriate verification function based on algorithm
    if (algorithm.startsWith('RSA')) {
      return verifyWithRSA(message, signature, publicKey, res);
    } else if (['P-256', 'P-384', 'P-521', 'secp256k1'].includes(algorithm)) {
      return verifyWithECDSA(algorithm, message, signature, publicKey, res);
    } else if (algorithm === 'Ed25519') {
      return verifyWithEd25519(message, signature, publicKey, res);
    } else {
      return res.status(400).json({
        success: false,
        error: 'Unsupported verification algorithm',
        message: `Algorithm '${algorithm}' is not supported for verification.`
      });
    }
  } catch (error) {
    console.error('Verification error:', error);
    return res.status(500).json({
      success: false,
      error: 'Verification failed',
      message: error.message
    });
  }
};

/**
 * Perform key exchange (ECDH) - NEW ENDPOINT
 */
export const performKeyExchange = async (req, res) => {
  try {
    const { privateKey, peerPublicKey, algorithm = 'P-256' } = req.body;

    // Check if algorithm supports key exchange
    if (!canKeyExchange(algorithm)) {
      return res.status(400).json({
        success: false,
        error: 'Algorithm does not support key exchange',
        message: `${algorithm} does not support ECDH key exchange. Supported algorithms: P-256, P-384, P-521, secp256k1, X25519`
      });
    }

    // Route to appropriate key exchange function
    if (['P-256', 'P-384', 'P-521', 'secp256k1'].includes(algorithm)) {
      return performECDH(algorithm, privateKey, peerPublicKey, res);
    } else if (algorithm === 'X25519') {
      return performX25519KeyExchange(privateKey, peerPublicKey, res);
    } else {
      return res.status(400).json({
        success: false,
        error: 'Unsupported key exchange algorithm',
        message: `Algorithm '${algorithm}' is not supported for key exchange.`
      });
    }
  } catch (error) {
    console.error('Key exchange error:', error);
    return res.status(500).json({
      success: false,
      error: 'Key exchange failed',
      message: error.message
    });
  }
};
