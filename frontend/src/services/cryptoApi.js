import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000/api/crypto';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Generate key pair (supports multiple algorithms)
 */
export const generateKeys = async (algorithm = 'RSA-2048') => {
  try {
    const response = await api.post('/generate-keys', { algorithm });
    return response.data;
  } catch (error) {
    throw handleError(error);
  }
};

/**
 * Encrypt message with public key (RSA only)
 */
export const encryptMessage = async (message, publicKey, algorithm = 'RSA-2048') => {
  try {
    const response = await api.post('/encrypt', {
      message,
      publicKey,
      algorithm
    });
    return response.data;
  } catch (error) {
    throw handleError(error);
  }
};

/**
 * Decrypt message with private key (RSA only)
 */
export const decryptMessage = async (encryptedData, privateKey, algorithm = 'RSA-2048') => {
  try {
    const response = await api.post('/decrypt', {
      encryptedData,
      privateKey,
      algorithm
    });
    return response.data;
  } catch (error) {
    throw handleError(error);
  }
};

/**
 * Sign message with private key (supports multiple algorithms)
 */
export const signMessage = async (message, privateKey, algorithm = 'RSA-2048') => {
  try {
    const response = await api.post('/sign', {
      message,
      privateKey,
      algorithm
    });
    return response.data;
  } catch (error) {
    throw handleError(error);
  }
};

/**
 * Verify signature with public key (supports multiple algorithms)
 */
export const verifySignature = async (message, signature, publicKey, algorithm = 'RSA-2048') => {
  try {
    const response = await api.post('/verify-signature', {
      message,
      signature,
      publicKey,
      algorithm
    });
    return response.data;
  } catch (error) {
    throw handleError(error);
  }
};

/**
 * Perform ECDH key exchange (NEW)
 */
export const performKeyExchange = async (privateKey, peerPublicKey, algorithm = 'P-256') => {
  try {
    const response = await api.post('/key-exchange', {
      privateKey,
      peerPublicKey,
      algorithm
    });
    return response.data;
  } catch (error) {
    throw handleError(error);
  }
};

/**
 * Handle API errors consistently
 */
const handleError = (error) => {
  if (error.response) {
    // Server responded with error
    return new Error(error.response.data.message || 'Server error occurred');
  } else if (error.request) {
    // Request made but no response
    return new Error('Cannot connect to server. Make sure backend is running on port 3000');
  } else {
    // Something else happened
    return new Error(error.message || 'An unexpected error occurred');
  }
};

export default {
  generateKeys,
  encryptMessage,
  decryptMessage,
  signMessage,
  verifySignature,
  performKeyExchange,
};
