import express from 'express';
import {
  generateKeyPair,
  encryptMessage,
  decryptMessage,
  signMessage,
  verifySignature
} from '../controllers/cryptoController.js';

const router = express.Router();

// Generate RSA key pair
router.post('/generate-keys', generateKeyPair);

// Encrypt message with public key
router.post('/encrypt', encryptMessage);

// Decrypt message with private key
router.post('/decrypt', decryptMessage);

// Sign message with private key
router.post('/sign', signMessage);

// Verify signature with public key
router.post('/verify-signature', verifySignature);

export default router;
