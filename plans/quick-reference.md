# Multi-Algorithm Crypto - Quick Reference Guide

## 📊 Algorithm Quick Comparison

```
┌──────────────┬──────────┬──────────┬──────┬────────┬───────────┬───────┐
│ Algorithm    │ Encrypt  │ Decrypt  │ Sign │ Verify │ ECDH      │ Speed │
├──────────────┼──────────┼──────────┼──────┼────────┼───────────┼───────┤
│ RSA-2048     │    ✅    │    ✅    │  ✅  │   ✅   │     ❌    │   ⭐  │
│ RSA-3072     │    ✅    │    ✅    │  ✅  │   ✅   │     ❌    │   ⭐  │
│ RSA-4096     │    ✅    │    ✅    │  ✅  │   ✅   │     ❌    │   ⭐  │
│ P-256        │    ❌    │    ❌    │  ✅  │   ✅   │     ✅    │  ⭐⭐⭐⭐│
│ P-384        │    ❌    │    ❌    │  ✅  │   ✅   │     ✅    │  ⭐⭐⭐ │
│ P-521        │    ❌    │    ❌    │  ✅  │   ✅   │     ✅    │  ⭐⭐⭐ │
│ secp256k1    │    ❌    │    ❌    │  ✅  │   ✅   │     ✅    │  ⭐⭐⭐⭐│
│ Ed25519      │    ❌    │    ❌    │  ✅  │   ✅   │     ❌    │ ⭐⭐⭐⭐⭐│
│ X25519       │    ❌    │    ❌    │  ❌  │   ❌   │     ✅    │ ⭐⭐⭐⭐⭐│
└──────────────┴──────────┴──────────┴──────┴────────┴───────────┴───────┘
```

## 🎯 When to Use Each Algorithm

| Use Case | Recommended Algorithm | Why? |
|----------|----------------------|------|
| **Email Encryption** | RSA-2048/3072 | Direct encryption support |
| **File Encryption** | P-256 + AES (hybrid) | Fast, secure, handles large files |
| **Digital Signatures** | Ed25519 | Fastest, most secure |
| **Secure Chat/Messaging** | X25519 + AES | Forward secrecy, fast key exchange |
| **Code Signing** | RSA-3072 or P-384 | Wide compatibility |
| **IoT Devices** | Ed25519 or P-256 | Low computation, small keys |
| **Blockchain/Crypto** | secp256k1 | Industry standard |
| **High Security (Gov/Military)** | P-521 or RSA-4096 | Maximum security |

## 🔧 Implementation Priority Order

### Phase 1: Core Backend (Start Here)
1. ✅ Create algorithm validator utility
2. ✅ Implement RSA variants (2048, 3072, 4096)  
3. ✅ Implement P-256 (most common ECC)
4. ✅ Implement Ed25519 (modern signatures)
5. ✅ Update main controller routing
6. ✅ Add key-exchange endpoint

### Phase 2: Extended Backend
7. ✅ Implement P-384, P-521
8. ✅ Implement secp256k1
9. ✅ Implement X25519

### Phase 3: Frontend Components
10. ✅ Create AlgorithmSelector component
11. ✅ Update KeyPairGenerator
12. ✅ Update DigitalSignature
13. ✅ Create KeyExchange component
14. ✅ Update EncryptDecrypt (conditional rendering)

### Phase 4: Polish & Education
15. ✅ Create AlgorithmComparison component
16. ✅ Update App.jsx state management
17. ✅ Add tooltips and help text
18. ✅ Update documentation

## 📝 Code Snippets

### Backend: Generate ECC Keys
```javascript
const { publicKey, privateKey } = crypto.generateKeyPairSync('ec', {
  namedCurve: 'prime256v1', // P-256
  publicKeyEncoding: { type: 'spki', format: 'pem' },
  privateKeyEncoding: { type: 'pkcs8', format: 'pem' }
});
```

### Backend: ECDSA Sign
```javascript
const sign = crypto.createSign('SHA256');
sign.update(message);
sign.end();
const signature = sign.sign(privateKey);
```

### Backend: Ed25519 Keys
```javascript
const { publicKey, privateKey } = crypto.generateKeyPairSync('ed25519', {
  publicKeyEncoding: { type: 'spki', format: 'pem' },
  privateKeyEncoding: { type: 'pkcs8', format: 'pem' }
});
```

### Backend: ECDH Key Exchange
```javascript
const ecdh = crypto.createECDH('prime256v1');
// Load keys and compute shared secret
const sharedSecret = crypto.diffieHellman({
  privateKey: yourPrivateKey,
  publicKey: theirPublicKey
});
```

### Frontend: Algorithm Selection
```jsx
<AlgorithmSelector
  value={selectedAlgorithm}
  onChange={setSelectedAlgorithm}
/>
```

### Frontend: Conditional Features
```jsx
const canEncrypt = algorithm.startsWith('RSA');
const canSign = !algorithm.startsWith('X25519');
const canKeyExchange = ['P-256', 'P-384', 'P-521', 'secp256k1', 'X25519'].includes(algorithm);
```

## 🗂️ File Changes Summary

### New Files (12)
```
backend/src/
├── controllers/algorithms/
│   ├── rsaAlgorithm.js          [NEW]
│   ├── eccAlgorithm.js          [NEW]
│   ├── ed25519Algorithm.js      [NEW]
│   └── x25519Algorithm.js       [NEW]
└── utils/
    └── algorithmValidator.js    [NEW]

frontend/src/
└── components/
    ├── AlgorithmSelector.jsx    [NEW]
    ├── AlgorithmComparison.jsx  [NEW]
    └── KeyExchange.jsx          [NEW]

docs/
└── ALGORITHM_GUIDE.md           [NEW]
```

### Modified Files (8)
```
backend/src/
├── controllers/cryptoController.js  [MODIFY]
└── routes/crypto.js                 [MODIFY]

frontend/src/
├── components/
│   ├── KeyPairGenerator.jsx         [MODIFY]
│   ├── EncryptDecrypt.jsx           [MODIFY]
│   └── DigitalSignature.jsx         [MODIFY]
├── services/cryptoApi.js            [MODIFY]
└── App.jsx                          [MODIFY]

README.md                             [MODIFY]
```

## 🧪 Testing Checklist

### Manual Tests
- [ ] Generate keys for all 9 algorithms
- [ ] Encrypt/decrypt with RSA-2048, RSA-3072, RSA-4096
- [ ] Sign/verify with P-256, P-384, P-521, secp256k1
- [ ] Sign/verify with Ed25519
- [ ] Key exchange with P-256, P-384, P-521, secp256k1, X25519
- [ ] Verify error when trying to encrypt with ECC
- [ ] Verify error when trying to sign with X25519
- [ ] Copy/paste keys between operations
- [ ] Test with invalid keys
- [ ] Test with mismatched algorithm/key pairs

### API Tests
```bash
# Test key generation
curl -X POST http://localhost:3000/api/crypto/generate-keys \
  -H "Content-Type: application/json" \
  -d '{"algorithm": "P-256"}'

# Test ECDSA signing
curl -X POST http://localhost:3000/api/crypto/sign \
  -H "Content-Type: application/json" \
  -d '{"algorithm": "P-256", "message": "test", "privateKey": "..."}'

# Test ECDH
curl -X POST http://localhost:3000/api/crypto/key-exchange \
  -H "Content-Type: application/json" \
  -d '{"algorithm": "P-256", "privateKey": "...", "peerPublicKey": "..."}'
```

## 📚 Important Notes

### ECC Limitations
- **No Direct Encryption**: ECC curves cannot encrypt/decrypt like RSA
- **Use Hybrid Encryption**: ECDH (key exchange) + AES (symmetric)
- **Smaller Keys**: 256-bit ECC ≈ 2048-bit RSA security

### Algorithm Pairing
- **P-256**: Use SHA-256 for hashing
- **P-384**: Use SHA-384 for hashing
- **P-521**: Use SHA-512 for hashing
- **Ed25519**: Uses SHA-512 internally (automatic)

### Security Equivalence
| ECC Key Size | RSA Equivalent | Security Level |
|--------------|----------------|----------------|
| 256-bit      | 3072-bit       | 128-bit        |
| 384-bit      | 7680-bit       | 192-bit        |
| 521-bit      | 15360-bit      | 256-bit        |

## 🎨 UI/UX Guidelines

### Visual Indicators
- **RSA algorithms**: 🔐 icon, blue color scheme
- **ECC algorithms**: 🔑 icon, green color scheme  
- **Ed25519**: ⚡ icon, purple color scheme
- **X25519**: 🔗 icon, orange color scheme

### Error Messages
```javascript
// Good error message
"P-256 does not support encryption. Use RSA or implement hybrid encryption with ECDH + AES."

// Bad error message
"Operation not supported."
```

### Help Text Examples
- **RSA**: "Traditional public-key encryption. Supports direct encryption of data."
- **P-256**: "Modern elliptic curve. Fast signatures and key exchange."
- **Ed25519**: "Optimized for digital signatures. Fastest and most secure."
- **X25519**: "Specialized for key exchange only. Perfect for forward secrecy."

## 🚀 Deployment Notes

### Environment Variables
```env
# No changes needed - uses same ports
PORT=3000
NODE_ENV=development
```

### Dependencies
```json
// No new dependencies needed!
// Node.js crypto module supports all algorithms natively
```

### Performance Expectations
- RSA-2048 key gen: ~1-2 seconds
- RSA-4096 key gen: ~5-10 seconds
- ECC key gen: ~50-100ms (20-40x faster!)
- Ed25519 key gen: ~10-30ms (fastest!)

## 💡 Future Enhancements

### Next Features to Consider
1. **Hybrid Encryption**: ECDH + AES for large file encryption
2. **Key Import/Export**: Save keys to files
3. **Certificate Generation**: X.509 certificates
4. **Multiple Key Pairs**: Manage multiple identities
5. **Performance Benchmarks**: Real-time speed comparison
6. **Dark Mode**: Theme support
7. **Mobile App**: React Native version

---

**Ready to code?** Use this guide alongside the detailed architecture and implementation roadmap documents.
