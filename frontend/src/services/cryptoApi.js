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
 * Generate RSA key pair
 */
export const generateKeys = async () => {
  try {
    const response = await api.post('/generate-keys');
    return response.data;
  } catch (error) {
    throw handleError(error);
  }
};

/**
 * Encrypt message with public key
 */
export const encryptMessage = async (message, publicKey) => {
  try {
    const response = await api.post('/encrypt', {
      message,
      publicKey,
    });
    return response.data;
  } catch (error) {
    throw handleError(error);
  }
};

/**
 * Decrypt message with private key
 */
export const decryptMessage = async (encryptedData, privateKey) => {
  try {
    const response = await api.post('/decrypt', {
      encryptedData,
      privateKey,
    });
    return response.data;
  } catch (error) {
    throw handleError(error);
  }
};

/**
 * Sign message with private key
 */
export const signMessage = async (message, privateKey) => {
  try {
    const response = await api.post('/sign', {
      message,
      privateKey,
    });
    return response.data;
  } catch (error) {
    throw handleError(error);
  }
};

/**
 * Verify signature with public key
 */
export const verifySignature = async (message, signature, publicKey) => {
  try {
    const response = await api.post('/verify-signature', {
      message,
      signature,
      publicKey,
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
};
