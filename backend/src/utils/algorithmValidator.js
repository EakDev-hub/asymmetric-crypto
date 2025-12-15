/**
 * Algorithm Validator - Defines capabilities for each cryptographic algorithm
 */

export const ALGORITHM_CAPABILITIES = {
  'RSA-2048': ['encrypt', 'decrypt', 'sign', 'verify'],
  'RSA-3072': ['encrypt', 'decrypt', 'sign', 'verify'],
  'RSA-4096': ['encrypt', 'decrypt', 'sign', 'verify'],
  'P-256': ['sign', 'verify', 'ecdh'],
  'P-384': ['sign', 'verify', 'ecdh'],
  'P-521': ['sign', 'verify', 'ecdh'],
  'secp256k1': ['sign', 'verify', 'ecdh'],
  'Ed25519': ['sign', 'verify'],
  'X25519': ['ecdh']
};

export const ALGORITHM_METADATA = {
  'RSA-2048': { type: 'rsa', keySize: 2048, securityLevel: 112 },
  'RSA-3072': { type: 'rsa', keySize: 3072, securityLevel: 128 },
  'RSA-4096': { type: 'rsa', keySize: 4096, securityLevel: 152 },
  'P-256': { type: 'ec', curve: 'prime256v1', keySize: 256, securityLevel: 128 },
  'P-384': { type: 'ec', curve: 'secp384r1', keySize: 384, securityLevel: 192 },
  'P-521': { type: 'ec', curve: 'secp521r1', keySize: 521, securityLevel: 256 },
  'secp256k1': { type: 'ec', curve: 'secp256k1', keySize: 256, securityLevel: 128 },
  'Ed25519': { type: 'ed25519', keySize: 256, securityLevel: 128 },
  'X25519': { type: 'x25519', keySize: 256, securityLevel: 128 }
};

/**
 * Check if an algorithm is supported
 */
export const isAlgorithmSupported = (algorithm) => {
  return algorithm in ALGORITHM_CAPABILITIES;
};

/**
 * Check if an algorithm can encrypt
 */
export const canEncrypt = (algorithm) => {
  return ALGORITHM_CAPABILITIES[algorithm]?.includes('encrypt') || false;
};

/**
 * Check if an algorithm can decrypt
 */
export const canDecrypt = (algorithm) => {
  return ALGORITHM_CAPABILITIES[algorithm]?.includes('decrypt') || false;
};

/**
 * Check if an algorithm can sign
 */
export const canSign = (algorithm) => {
  return ALGORITHM_CAPABILITIES[algorithm]?.includes('sign') || false;
};

/**
 * Check if an algorithm can verify signatures
 */
export const canVerify = (algorithm) => {
  return ALGORITHM_CAPABILITIES[algorithm]?.includes('verify') || false;
};

/**
 * Check if an algorithm supports key exchange (ECDH)
 */
export const canKeyExchange = (algorithm) => {
  return ALGORITHM_CAPABILITIES[algorithm]?.includes('ecdh') || false;
};

/**
 * Get algorithm capabilities
 */
export const getCapabilities = (algorithm) => {
  return ALGORITHM_CAPABILITIES[algorithm] || [];
};

/**
 * Get algorithm metadata
 */
export const getMetadata = (algorithm) => {
  return ALGORITHM_METADATA[algorithm] || null;
};

/**
 * Validate algorithm for specific operation
 */
export const validateOperation = (algorithm, operation) => {
  if (!isAlgorithmSupported(algorithm)) {
    throw new Error(`Unsupported algorithm: ${algorithm}`);
  }

  const capabilities = ALGORITHM_CAPABILITIES[algorithm];
  if (!capabilities.includes(operation)) {
    const supportedOps = capabilities.join(', ');
    throw new Error(
      `${algorithm} does not support ${operation}. Supported operations: ${supportedOps}`
    );
  }

  return true;
};

export default {
  ALGORITHM_CAPABILITIES,
  ALGORITHM_METADATA,
  isAlgorithmSupported,
  canEncrypt,
  canDecrypt,
  canSign,
  canVerify,
  canKeyExchange,
  getCapabilities,
  getMetadata,
  validateOperation
};
