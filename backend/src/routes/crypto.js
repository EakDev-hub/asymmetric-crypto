import express from 'express';
import {
  generateKeyPair,
  encryptMessage,
  decryptMessage,
  signMessage,
  verifySignature,
  performKeyExchange
} from '../controllers/cryptoController.js';

const router = express.Router();

// Generate key pair (supports multiple algorithms)
router.post('/generate-keys', generateKeyPair);

// Encrypt message with public key (RSA only)
router.post('/encrypt', encryptMessage);

// Decrypt message with private key (RSA only)
router.post('/decrypt', decryptMessage);

// Sign message with private key (RSA, ECC, Ed25519)
router.post('/sign', signMessage);

// Verify signature with public key (RSA, ECC, Ed25519)
router.post('/verify-signature', verifySignature);

// Perform ECDH key exchange (ECC curves, X25519)
router.post('/key-exchange', performKeyExchange);

export default router;
