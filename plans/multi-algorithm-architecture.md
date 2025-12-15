# Multi-Algorithm Cryptography Architecture Plan

## Executive Summary

This plan extends the asymmetric-crypto application to support multiple encryption algorithms beyond RSA-2048, including:
- **ECC (Elliptic Curve Cryptography)**: secp256k1, P-256 (prime256v1), P-384, P-521
- **Ed25519/EdDSA**: For fast digital signatures
- **X25519**: For key exchange (ECDH)
- **RSA**: Enhanced with multiple key sizes (2048, 3072, 4096)

## Algorithm Comparison

### Supported Algorithms Overview

| Algorithm | Key Size | Use Cases | Speed | Security Level | Node.js Support |
|-----------|----------|-----------|-------|----------------|-----------------|
| **RSA-2048** | 2048-bit | Encrypt, Decrypt, Sign, Verify | Slow | 112-bit | ✅ Native |
| **RSA-3072** | 3072-bit | Encrypt, Decrypt, Sign, Verify | Slower | 128-bit | ✅ Native |
| **RSA-4096** | 4096-bit | Encrypt, Decrypt, Sign, Verify | Slowest | 152-bit | ✅ Native |
| **P-256** | 256-bit | Sign, Verify, ECDH | Fast | 128-bit | ✅ Native |
| **P-384** | 384-bit | Sign, Verify, ECDH | Fast | 192-bit | ✅ Native |
| **P-521** | 521-bit | Sign, Verify, ECDH | Fast | 256-bit | ✅ Native |
| **secp256k1** | 256-bit | Sign, Verify, ECDH | Fast | 128-bit | ✅ Native |
| **Ed25519** | 256-bit | Sign, Verify (EdDSA) | Very Fast | 128-bit | ✅ Native |
| **X25519** | 256-bit | Key Exchange (ECDH) | Very Fast | 128-bit | ✅ Native |

### Algorithm Capabilities Matrix

```
┌─────────────┬──────────┬──────────┬──────┬────────┬────────────┐
│ Algorithm   │ Encrypt  │ Decrypt  │ Sign │ Verify │ Key Exchange│
├─────────────┼──────────┼──────────┼──────┼────────┼────────────┤
│ RSA         │    ✅    │    ✅    │  ✅  │   ✅   │     ❌     │
│ P-256       │    ❌    │    ❌    │  ✅  │   ✅   │     ✅     │
│ P-384       │    ❌    │    ❌    │  ✅  │   ✅   │     ✅     │
│ P-521       │    ❌    │    ❌    │  ✅  │   ✅   │     ✅     │
│ secp256k1   │    ❌    │    ❌    │  ✅  │   ✅   │     ✅     │
│ Ed25519     │    ❌    │    ❌    │  ✅  │   ✅   │     ❌     │
│ X25519      │    ❌    │    ❌    │  ❌  │   ❌   │     ✅     │
└─────────────┴──────────┴──────────┴──────┴────────┴────────────┘
```

**Important Notes:**
- **ECC curves do NOT support direct encryption/decryption** (unlike RSA)
- ECC is used for: Digital Signatures (ECDSA) and Key Exchange (ECDH)
- For ECC-based encryption, use hybrid encryption: ECDH + AES (future enhancement)
- Ed25519 is optimized for signatures only (EdDSA algorithm)
- X25519 is optimized for key exchange only (ECDH algorithm)

## Architectural Changes

### 1. Backend API Design

#### New Request Format
All endpoints will accept an `algorithm` parameter to specify the cryptographic algorithm.

```javascript
// Example: Generate Keys Request
POST /api/crypto/generate-keys
{
  "algorithm": "RSA-2048" | "RSA-3072" | "RSA-4096" | 
               "P-256" | "P-384" | "P-521" | "secp256k1" |
               "Ed25519" | "X25519"
}

// Example: Sign Message Request
POST /api/crypto/sign
{
  "algorithm": "P-256",
  "message": "Hello World",
  "privateKey": "-----BEGIN PRIVATE KEY-----..."
}
```

#### Updated Endpoint Specifications

**1. Generate Keys Endpoint**
```javascript
POST /api/crypto/generate-keys

Request Body:
{
  "algorithm": "P-256",  // Algorithm selection
  "keySize": 2048        // Optional: For RSA only
}

Response (RSA):
{
  "success": true,
  "algorithm": "RSA-2048",
  "publicKey": "-----BEGIN PUBLIC KEY-----...",
  "privateKey": "-----BEGIN PRIVATE KEY-----...",
  "keySize": 2048,
  "capabilities": ["encrypt", "decrypt", "sign", "verify"]
}

Response (ECC - P-256):
{
  "success": true,
  "algorithm": "P-256",
  "publicKey": "-----BEGIN PUBLIC KEY-----...",
  "privateKey": "-----BEGIN PRIVATE KEY-----...",
  "curve": "prime256v1",
  "keySize": 256,
  "capabilities": ["sign", "verify", "ecdh"]
}

Response (Ed25519):
{
  "success": true,
  "algorithm": "Ed25519",
  "publicKey": "-----BEGIN PUBLIC KEY-----...",
  "privateKey": "-----BEGIN PRIVATE KEY-----...",
  "keySize": 256,
  "capabilities": ["sign", "verify"]
}
```

**2. Encrypt Endpoint** (RSA only)
```javascript
POST /api/crypto/encrypt

Request Body:
{
  "algorithm": "RSA-2048",
  "message": "Secret message",
  "publicKey": "-----BEGIN PUBLIC KEY-----..."
}

Response:
{
  "success": true,
  "encrypted": "base64_encoded_data",
  "algorithm": "RSA-OAEP",
  "padding": "OAEP",
  "hash": "SHA-256"
}

Error Response (for ECC):
{
  "success": false,
  "error": "Algorithm not supported for encryption",
  "message": "P-256 does not support direct encryption. Use RSA or implement hybrid encryption (ECDH + AES)"
}
```

**3. Sign Endpoint** (All algorithms except X25519)
```javascript
POST /api/crypto/sign

Request Body:
{
  "algorithm": "P-256",
  "message": "Message to sign",
  "privateKey": "-----BEGIN PRIVATE KEY-----..."
}

Response (ECDSA):
{
  "success": true,
  "signature": "base64_encoded_signature",
  "algorithm": "ECDSA-SHA256",
  "curve": "prime256v1",
  "hash": "SHA-256"
}

Response (Ed25519):
{
  "success": true,
  "signature": "base64_encoded_signature",
  "algorithm": "EdDSA",
  "hash": "SHA-512"  // Ed25519 uses SHA-512 internally
}
```

**4. New Endpoint: ECDH Key Exchange**
```javascript
POST /api/crypto/key-exchange

Request Body:
{
  "algorithm": "P-256" | "X25519",
  "privateKey": "-----BEGIN PRIVATE KEY-----...",
  "peerPublicKey": "-----BEGIN PUBLIC KEY-----..."
}

Response:
{
  "success": true,
  "sharedSecret": "base64_encoded_shared_secret",
  "algorithm": "ECDH",
  "curve": "prime256v1",
  "length": 32  // bytes
}
```

### 2. Backend Controller Structure

```javascript
// backend/src/controllers/cryptoController.js

// Algorithm-specific key generation
export const generateKeyPair = async (req, res) => {
  const { algorithm = 'RSA-2048', keySize } = req.body;
  
  switch(algorithm) {
    case 'RSA-2048':
    case 'RSA-3072':
    case 'RSA-4096':
      return generateRSAKeys(algorithm, keySize, res);
    
    case 'P-256':
    case 'P-384':
    case 'P-521':
    case 'secp256k1':
      return generateECCKeys(algorithm, res);
    
    case 'Ed25519':
      return generateEd25519Keys(res);
    
    case 'X25519':
      return generateX25519Keys(res);
    
    default:
      return res.status(400).json({
        success: false,
        error: 'Unsupported algorithm'
      });
  }
};

// Algorithm-agnostic signing (routes to correct implementation)
export const signMessage = async (req, res) => {
  const { algorithm, message, privateKey } = req.body;
  
  if (algorithm.startsWith('RSA')) {
    return signWithRSA(message, privateKey, res);
  } else if (algorithm === 'Ed25519') {
    return signWithEd25519(message, privateKey, res);
  } else {
    return signWithECDSA(algorithm, message, privateKey, res);
  }
};

// New: ECDH Key Exchange
export const performKeyExchange = async (req, res) => {
  const { algorithm, privateKey, peerPublicKey } = req.body;
  
  if (['P-256', 'P-384', 'P-521', 'secp256k1', 'X25519'].includes(algorithm)) {
    return performECDH(algorithm, privateKey, peerPublicKey, res);
  } else {
    return res.status(400).json({
      success: false,
      error: 'Algorithm does not support key exchange'
    });
  }
};
```

### 3. Frontend Component Updates

#### Algorithm Selection UI

```javascript
// New component: frontend/src/components/AlgorithmSelector.jsx

const ALGORITHMS = [
  {
    id: 'RSA-2048',
    name: 'RSA-2048',
    description: 'Classic RSA with 2048-bit keys',
    capabilities: ['encrypt', 'decrypt', 'sign', 'verify'],
    speed: '⭐',
    security: '⭐⭐⭐'
  },
  {
    id: 'P-256',
    name: 'ECDSA P-256',
    description: 'Modern elliptic curve (NIST prime256v1)',
    capabilities: ['sign', 'verify', 'keyExchange'],
    speed: '⭐⭐⭐⭐',
    security: '⭐⭐⭐⭐'
  },
  {
    id: 'Ed25519',
    name: 'Ed25519',
    description: 'Fast EdDSA signatures',
    capabilities: ['sign', 'verify'],
    speed: '⭐⭐⭐⭐⭐',
    security: '⭐⭐⭐⭐'
  },
  // ... more algorithms
];

const AlgorithmSelector = ({ selectedAlgorithm, onSelect }) => {
  return (
    <div className="algorithm-selector">
      <label>Select Cryptographic Algorithm:</label>
      <select 
        value={selectedAlgorithm} 
        onChange={(e) => onSelect(e.target.value)}
      >
        {ALGORITHMS.map(algo => (
          <option key={algo.id} value={algo.id}>
            {algo.name} - {algo.description}
          </option>
        ))}
      </select>
      
      {/* Show capabilities */}
      <div className="capabilities">
        {getAlgorithmCapabilities(selectedAlgorithm)}
      </div>
    </div>
  );
};
```

#### Updated KeyPairGenerator Component

```javascript
// frontend/src/components/KeyPairGenerator.jsx

const KeyPairGenerator = ({ onKeysGenerated }) => {
  const [selectedAlgorithm, setSelectedAlgorithm] = useState('RSA-2048');
  const [keys, setKeys] = useState(null);
  
  const handleGenerateKeys = async () => {
    setLoading(true);
    try {
      const response = await generateKeys(selectedAlgorithm);
      setKeys(response);
      onKeysGenerated(response.publicKey, response.privateKey, selectedAlgorithm);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div>
      <AlgorithmSelector 
        selectedAlgorithm={selectedAlgorithm}
        onSelect={setSelectedAlgorithm}
      />
      
      <button onClick={handleGenerateKeys}>
        Generate {selectedAlgorithm} Key Pair
      </button>
      
      {/* Display keys with algorithm-specific info */}
    </div>
  );
};
```

### 4. Data Flow Diagram

```mermaid
graph TB
    User[User] --> AlgoSelect[Select Algorithm]
    AlgoSelect --> GenKey[Generate Keys]
    
    GenKey --> IsRSA{Is RSA?}
    IsRSA -->|Yes| RSAGen[Generate RSA Keys<br/>crypto.generateKeyPairSync]
    IsRSA -->|No| IsECC{Is ECC?}
    
    IsECC -->|Yes| ECCGen[Generate ECC Keys<br/>ec curve]
    IsECC -->|No| IsEd{Is Ed25519?}
    
    IsEd -->|Yes| EdGen[Generate Ed25519 Keys<br/>ed25519 curve]
    IsEd -->|No| X25519Gen[Generate X25519 Keys<br/>x25519 curve]
    
    RSAGen --> ShowKeys[Display Keys]
    ECCGen --> ShowKeys
    EdGen --> ShowKeys
    X25519Gen --> ShowKeys
    
    ShowKeys --> Operation{Choose Operation}
    
    Operation -->|Encrypt| CheckEncrypt{Algorithm<br/>supports<br/>encryption?}
    CheckEncrypt -->|RSA| EncryptRSA[RSA Encryption]
    CheckEncrypt -->|ECC| ErrorMsg[Show Error:<br/>Use RSA or<br/>Hybrid Encryption]
    
    Operation -->|Sign| CheckSign{Algorithm<br/>type?}
    CheckSign -->|RSA| SignRSA[RSA-PSS Signature]
    CheckSign -->|ECDSA| SignECDSA[ECDSA Signature]
    CheckSign -->|Ed25519| SignEd[EdDSA Signature]
    
    Operation -->|Key Exchange| CheckKX{Algorithm<br/>supports<br/>ECDH?}
    CheckKX -->|Yes| ECDH[Perform ECDH<br/>Generate Shared Secret]
    CheckKX -->|No| ErrorMsg2[Show Error:<br/>Not Supported]
```

### 5. Algorithm Implementation Details

#### RSA Implementation (Enhanced)

```javascript
// Multiple key sizes supported
const generateRSAKeys = (algorithm, customKeySize, res) => {
  const keySizeMap = {
    'RSA-2048': 2048,
    'RSA-3072': 3072,
    'RSA-4096': 4096
  };
  
  const modulusLength = customKeySize || keySizeMap[algorithm];
  
  const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
    modulusLength,
    publicKeyEncoding: { type: 'spki', format: 'pem' },
    privateKeyEncoding: { type: 'pkcs8', format: 'pem' }
  });
  
  return res.json({
    success: true,
    algorithm,
    publicKey,
    privateKey,
    keySize: modulusLength,
    capabilities: ['encrypt', 'decrypt', 'sign', 'verify']
  });
};
```

#### ECC Implementation

```javascript
const generateECCKeys = (algorithm, res) => {
  const curveMap = {
    'P-256': 'prime256v1',
    'P-384': 'secp384r1',
    'P-521': 'secp521r1',
    'secp256k1': 'secp256k1'
  };
  
  const namedCurve = curveMap[algorithm];
  
  const { publicKey, privateKey } = crypto.generateKeyPairSync('ec', {
    namedCurve,
    publicKeyEncoding: { type: 'spki', format: 'pem' },
    privateKeyEncoding: { type: 'pkcs8', format: 'pem' }
  });
  
  return res.json({
    success: true,
    algorithm,
    curve: namedCurve,
    publicKey,
    privateKey,
    keySize: algorithm === 'P-521' ? 521 : parseInt(algorithm.split('-')[1]) || 256,
    capabilities: ['sign', 'verify', 'ecdh']
  });
};

// ECDSA Signing
const signWithECDSA = (algorithm, message, privateKey, res) => {
  const sign = crypto.createSign('SHA256');
  sign.update(message);
  sign.end();
  
  const signature = sign.sign(privateKey);
  
  return res.json({
    success: true,
    signature: signature.toString('base64'),
    algorithm: 'ECDSA-SHA256',
    hash: 'SHA-256'
  });
};

// ECDH Key Exchange
const performECDH = (algorithm, privateKey, peerPublicKey, res) => {
  const ecdh = crypto.createECDH(getCurveName(algorithm));
  
  // Import private key
  const privateKeyObj = crypto.createPrivateKey(privateKey);
  const privateKeyBuffer = privateKeyObj.export({
    type: 'sec1',
    format: 'der'
  });
  
  ecdh.setPrivateKey(privateKeyBuffer);
  
  // Compute shared secret
  const peerPublicKeyObj = crypto.createPublicKey(peerPublicKey);
  const sharedSecret = ecdh.computeSecret(peerPublicKeyObj);
  
  return res.json({
    success: true,
    sharedSecret: sharedSecret.toString('base64'),
    algorithm: 'ECDH',
    length: sharedSecret.length
  });
};
```

#### Ed25519 Implementation

```javascript
const generateEd25519Keys = (res) => {
  const { publicKey, privateKey } = crypto.generateKeyPairSync('ed25519', {
    publicKeyEncoding: { type: 'spki', format: 'pem' },
    privateKeyEncoding: { type: 'pkcs8', format: 'pem' }
  });
  
  return res.json({
    success: true,
    algorithm: 'Ed25519',
    publicKey,
    privateKey,
    keySize: 256,
    capabilities: ['sign', 'verify']
  });
};

const signWithEd25519 = (message, privateKey, res) => {
  const sign = crypto.createSign(null); // Ed25519 doesn't need hash algorithm
  sign.update(message);
  sign.end();
  
  const signature = sign.sign(privateKey);
  
  return res.json({
    success: true,
    signature: signature.toString('base64'),
    algorithm: 'EdDSA',
    hash: 'SHA-512'
  });
};
```

#### X25519 Implementation

```javascript
const generateX25519Keys = (res) => {
  const { publicKey, privateKey } = crypto.generateKeyPairSync('x25519', {
    publicKeyEncoding: { type: 'spki', format: 'pem' },
    privateKeyEncoding: { type: 'pkcs8', format: 'pem' }
  });
  
  return res.json({
    success: true,
    algorithm: 'X25519',
    publicKey,
    privateKey,
    keySize: 256,
    capabilities: ['ecdh']
  });
};
```

### 6. Frontend Service Layer Updates

```javascript
// frontend/src/services/cryptoApi.js

export const generateKeys = async (algorithm = 'RSA-2048') => {
  const response = await api.post('/generate-keys', { algorithm });
  return response.data;
};

export const signMessage = async (algorithm, message, privateKey) => {
  const response = await api.post('/sign', {
    algorithm,
    message,
    privateKey
  });
  return response.data;
};

// New: Key Exchange
export const performKeyExchange = async (algorithm, privateKey, peerPublicKey) => {
  const response = await api.post('/key-exchange', {
    algorithm,
    privateKey,
    peerPublicKey
  });
  return response.data;
};
```

### 7. New Frontend Component: Key Exchange

```javascript
// frontend/src/components/KeyExchange.jsx

const KeyExchange = ({ algorithm, privateKey }) => {
  const [peerPublicKey, setPeerPublicKey] = useState('');
  const [sharedSecret, setSharedSecret] = useState('');
  
  const handleKeyExchange = async () => {
    try {
      const response = await performKeyExchange(
        algorithm,
        privateKey,
        peerPublicKey
      );
      setSharedSecret(response.sharedSecret);
    } catch (err) {
      setError(err.message);
    }
  };
  
  return (
    <div className="card">
      <h3>🔗 ECDH Key Exchange</h3>
      <p>Exchange keys with another party to derive a shared secret</p>
      
      <textarea
        placeholder="Paste peer's public key..."
        value={peerPublicKey}
        onChange={(e) => setPeerPublicKey(e.target.value)}
      />
      
      <button onClick={handleKeyExchange}>
        Generate Shared Secret
      </button>
      
      {sharedSecret && (
        <div>
          <h4>Shared Secret:</h4>
          <code>{sharedSecret}</code>
          <p className="info">
            This secret can be used for symmetric encryption (AES)
          </p>
        </div>
      )}
    </div>
  );
};
```

### 8. Algorithm Comparison Component

```javascript
// frontend/src/components/AlgorithmComparison.jsx

const AlgorithmComparison = () => {
  return (
    <div className="card">
      <h2>📊 Algorithm Comparison</h2>
      
      <table className="comparison-table">
        <thead>
          <tr>
            <th>Algorithm</th>
            <th>Key Size</th>
            <th>Speed</th>
            <th>Security</th>
            <th>Use Cases</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>RSA-2048</td>
            <td>2048-bit</td>
            <td>Slow</td>
            <td>High</td>
            <td>Encryption, Signatures</td>
          </tr>
          <tr>
            <td>P-256 (ECDSA)</td>
            <td>256-bit</td>
            <td>Fast</td>
            <td>High</td>
            <td>Signatures, Key Exchange</td>
          </tr>
          <tr>
            <td>Ed25519</td>
            <td>256-bit</td>
            <td>Very Fast</td>
            <td>High</td>
            <td>Digital Signatures</td>
          </tr>
          <tr>
            <td>X25519</td>
            <td>256-bit</td>
            <td>Very Fast</td>
            <td>High</td>
            <td>Key Exchange Only</td>
          </tr>
        </tbody>
      </table>
      
      <div className="info-section">
        <h3>💡 When to use which algorithm?</h3>
        <ul>
          <li><strong>RSA:</strong> Need direct encryption/decryption</li>
          <li><strong>P-256:</strong> Modern standard, good balance</li>
          <li><strong>P-384/P-521:</strong> Higher security requirements</li>
          <li><strong>secp256k1:</strong> Bitcoin/crypto applications</li>
          <li><strong>Ed25519:</strong> Maximum signature performance</li>
          <li><strong>X25519:</strong> Secure key agreement protocols</li>
        </ul>
      </div>
    </div>
  );
};
```

## Implementation Phases

### Phase 1: Backend Multi-Algorithm Support
1. Update controller to support algorithm parameter
2. Implement RSA variants (2048, 3072, 4096)
3. Implement ECC key generation (P-256, P-384, P-521, secp256k1)
4. Implement Ed25519 and X25519 key generation
5. Implement ECDSA signing/verification
6. Implement Ed25519 signing/verification
7. Implement ECDH key exchange
8. Add comprehensive error handling

### Phase 2: Frontend Algorithm Selection
1. Create AlgorithmSelector component
2. Update KeyPairGenerator with algorithm selection
3. Update EncryptDecrypt to show/hide based on capabilities
4. Update DigitalSignature to support all signature algorithms
5. Create new KeyExchange component
6. Add algorithm capability detection

### Phase 3: Educational Content
1. Create AlgorithmComparison component
2. Add tooltips explaining each algorithm
3. Update ProcessVisualization for ECC operations
4. Add performance metrics display
5. Create interactive algorithm selection guide

### Phase 4: Testing & Documentation
1. Test all algorithm combinations
2. Test error cases (unsupported operations)
3. Update API documentation
4. Update README with new features
5. Create algorithm selection guide

## Security Considerations

### Algorithm-Specific Notes

**RSA:**
- Minimum 2048-bit keys for security
- OAEP padding for encryption
- PSS padding recommended for signatures

**ECC Curves:**
- P-256/P-384/P-521: NIST standardized, widely trusted
- secp256k1: Used in Bitcoin, battle-tested
- Always use with SHA-256 or stronger hash

**Ed25519:**
- Immune to timing attacks
- No hash collision concerns
- Deterministic signatures (no randomness needed)

**X25519:**
- Optimized for Diffie-Hellman key exchange
- Constant-time implementation prevents side-channel attacks

### Best Practices

1. **Match Key Strength:**
   - RSA-2048 ≈ P-256 ≈ 128-bit security
   - RSA-3072 ≈ P-384 ≈ 192-bit security
   - RSA-4096 ≈ P-521 ≈ 256-bit security

2. **Hybrid Encryption for ECC:**
   - Use ECDH to derive shared secret
   - Use shared secret with AES for data encryption
   - Faster and supports larger messages

3. **Algorithm Selection:**
   - Modern apps: Prefer Ed25519 for signatures
   - Compatibility needed: Use P-256 or RSA
   - Maximum security: Use P-521 or RSA-4096

## Expected User Experience

### Workflow Example

1. **User selects algorithm:** Dropdown shows "P-256 (ECDSA)"
2. **System shows capabilities:** "✅ Sign, ✅ Verify, ✅ Key Exchange, ❌ Encrypt"
3. **User generates keys:** Fast generation (~50ms vs 2s for RSA)
4. **User tries to encrypt:** Error message: "P-256 doesn't support encryption. Use RSA or enable hybrid encryption."
5. **User creates signature:** Success with ECDSA-SHA256
6. **User performs key exchange:** Generates shared secret for AES encryption

## File Structure Changes

```
backend/src/
├── controllers/
│   ├── cryptoController.js         # Main controller (updated)
│   └── algorithms/                 # NEW FOLDER
│       ├── rsaAlgorithm.js        # RSA-specific logic
│       ├── eccAlgorithm.js        # ECC-specific logic
│       ├── ed25519Algorithm.js    # Ed25519 logic
│       └── x25519Algorithm.js     # X25519 logic
├── routes/
│   └── crypto.js                   # Add /key-exchange endpoint
└── utils/
    └── algorithmValidator.js       # NEW: Validate algorithm capabilities

frontend/src/
├── components/
│   ├── AlgorithmSelector.jsx      # NEW: Algorithm selection UI
│   ├── AlgorithmComparison.jsx    # NEW: Comparison table
│   ├── KeyExchange.jsx            # NEW: ECDH key exchange
│   ├── KeyPairGenerator.jsx       # UPDATED: Support all algorithms
│   ├── EncryptDecrypt.jsx         # UPDATED: Conditional rendering
│   └── DigitalSignature.jsx       # UPDATED: Support all signature algos
├── services/
│   └── cryptoApi.js               # UPDATED: Add algorithm params
└── utils/
    └── algorithmHelpers.js        # NEW: Algorithm metadata & helpers
```

## Success Metrics

- ✅ All 9 algorithms generate keys successfully
- ✅ RSA encryption/decryption works with all RSA variants
- ✅ All signature algorithms (RSA, ECDSA, Ed25519) work correctly
- ✅ ECDH key exchange works for P-256, P-384, P-521, secp256k1, X25519
- ✅ UI clearly shows which operations are supported per algorithm
- ✅ Error messages guide users when attempting unsupported operations
- ✅ Performance difference is visible (ECC faster than RSA)
- ✅ Educational content helps users choose the right algorithm

---

**Next Step:** Review this plan and approve to proceed with implementation in Code mode.
