# Multi-Algorithm Implementation Roadmap

## Overview
This document provides step-by-step implementation instructions for adding ECC, Ed25519, and X25519 support to the asymmetric-crypto application.

## Implementation Sequence

### Phase 1: Backend Foundation ⚙️

#### Step 1.1: Create Algorithm-Specific Modules

**File: `backend/src/controllers/algorithms/rsaAlgorithm.js`**
- Extract RSA logic from main controller
- Support multiple key sizes (2048, 3072, 4096)
- Implement encryption/decryption with OAEP padding
- Implement signing/verification with PSS padding

**File: `backend/src/controllers/algorithms/eccAlgorithm.js`**
- Generate ECC keys for curves: P-256, P-384, P-521, secp256k1
- Implement ECDSA signing with SHA-256
- Implement ECDSA verification
- Implement ECDH key exchange

**File: `backend/src/controllers/algorithms/ed25519Algorithm.js`**
- Generate Ed25519 key pairs
- Implement EdDSA signing
- Implement EdDSA verification

**File: `backend/src/controllers/algorithms/x25519Algorithm.js`**
- Generate X25519 key pairs
- Implement ECDH key exchange

**File: `backend/src/utils/algorithmValidator.js`**
```javascript
// Validates algorithm capabilities
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

export const canEncrypt = (algorithm) => 
  ALGORITHM_CAPABILITIES[algorithm]?.includes('encrypt');

export const canSign = (algorithm) => 
  ALGORITHM_CAPABILITIES[algorithm]?.includes('sign');

export const canKeyExchange = (algorithm) => 
  ALGORITHM_CAPABILITIES[algorithm]?.includes('ecdh');
```

#### Step 1.2: Update Main Controller

**File: `backend/src/controllers/cryptoController.js`**
- Import algorithm modules
- Add algorithm routing logic in `generateKeyPair()`
- Update `encryptMessage()` to check algorithm compatibility
- Update `signMessage()` to route to correct signing method
- Add `performKeyExchange()` for ECDH

#### Step 1.3: Create New Route

**File: `backend/src/routes/crypto.js`**
- Add `POST /key-exchange` endpoint
- Include algorithm validation middleware

### Phase 2: Frontend Components 🎨

#### Step 2.1: Create Algorithm Selector

**File: `frontend/src/components/AlgorithmSelector.jsx`**
```javascript
import React from 'react';

const ALGORITHMS = [
  {
    id: 'RSA-2048',
    name: 'RSA-2048',
    category: 'RSA',
    description: 'Classic RSA encryption (2048-bit)',
    icon: '🔐',
    capabilities: ['encrypt', 'decrypt', 'sign', 'verify'],
    speed: '⚡',
    security: '🛡️🛡️🛡️'
  },
  {
    id: 'RSA-3072',
    name: 'RSA-3072',
    category: 'RSA',
    description: 'Higher security RSA (3072-bit)',
    icon: '🔐',
    capabilities: ['encrypt', 'decrypt', 'sign', 'verify'],
    speed: '⚡',
    security: '🛡️🛡️🛡️🛡️'
  },
  {
    id: 'P-256',
    name: 'ECDSA P-256',
    category: 'ECC',
    description: 'NIST P-256 curve (prime256v1)',
    icon: '🔑',
    capabilities: ['sign', 'verify', 'ecdh'],
    speed: '⚡⚡⚡⚡',
    security: '🛡️🛡️🛡️🛡️'
  },
  {
    id: 'P-384',
    name: 'ECDSA P-384',
    category: 'ECC',
    description: 'NIST P-384 curve',
    icon: '🔑',
    capabilities: ['sign', 'verify', 'ecdh'],
    speed: '⚡⚡⚡',
    security: '🛡️🛡️🛡️🛡️🛡️'
  },
  {
    id: 'P-521',
    name: 'ECDSA P-521',
    category: 'ECC',
    description: 'NIST P-521 curve (highest security)',
    icon: '🔑',
    capabilities: ['sign', 'verify', 'ecdh'],
    speed: '⚡⚡⚡',
    security: '🛡️🛡️🛡️🛡️🛡️🛡️'
  },
  {
    id: 'secp256k1',
    name: 'secp256k1',
    category: 'ECC',
    description: 'Bitcoin curve',
    icon: '₿',
    capabilities: ['sign', 'verify', 'ecdh'],
    speed: '⚡⚡⚡⚡',
    security: '🛡️🛡️🛡️🛡️'
  },
  {
    id: 'Ed25519',
    name: 'Ed25519',
    category: 'Modern',
    description: 'EdDSA signatures (fastest & secure)',
    icon: '⚡',
    capabilities: ['sign', 'verify'],
    speed: '⚡⚡⚡⚡⚡',
    security: '🛡️🛡️🛡️🛡️'
  },
  {
    id: 'X25519',
    name: 'X25519',
    category: 'Modern',
    description: 'Key exchange only',
    icon: '🔗',
    capabilities: ['ecdh'],
    speed: '⚡⚡⚡⚡⚡',
    security: '🛡️🛡️🛡️🛡️'
  }
];

const AlgorithmSelector = ({ value, onChange, className = '' }) => {
  const selectedAlgo = ALGORITHMS.find(a => a.id === value);
  
  return (
    <div className={`algorithm-selector ${className}`}>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Select Cryptographic Algorithm
      </label>
      
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="input-field"
      >
        <optgroup label="RSA (Traditional)">
          {ALGORITHMS.filter(a => a.category === 'RSA').map(algo => (
            <option key={algo.id} value={algo.id}>
              {algo.icon} {algo.name} - {algo.description}
            </option>
          ))}
        </optgroup>
        
        <optgroup label="ECC (Elliptic Curve)">
          {ALGORITHMS.filter(a => a.category === 'ECC').map(algo => (
            <option key={algo.id} value={algo.id}>
              {algo.icon} {algo.name} - {algo.description}
            </option>
          ))}
        </optgroup>
        
        <optgroup label="Modern Curves">
          {ALGORITHMS.filter(a => a.category === 'Modern').map(algo => (
            <option key={algo.id} value={algo.id}>
              {algo.icon} {algo.name} - {algo.description}
            </option>
          ))}
        </optgroup>
      </select>
      
      {selectedAlgo && (
        <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded">
          <p className="text-sm font-semibold text-blue-900 mb-2">
            {selectedAlgo.icon} {selectedAlgo.name}
          </p>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div>
              <span className="font-medium">Speed:</span> {selectedAlgo.speed}
            </div>
            <div>
              <span className="font-medium">Security:</span> {selectedAlgo.security}
            </div>
          </div>
          <div className="mt-2">
            <span className="font-medium text-xs">Capabilities:</span>
            <div className="flex flex-wrap gap-1 mt-1">
              {selectedAlgo.capabilities.map(cap => (
                <span key={cap} className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">
                  {cap === 'encrypt' && '🔒 Encrypt'}
                  {cap === 'decrypt' && '🔓 Decrypt'}
                  {cap === 'sign' && '✍️ Sign'}
                  {cap === 'verify' && '✅ Verify'}
                  {cap === 'ecdh' && '🔗 Key Exchange'}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export { ALGORITHMS, AlgorithmSelector };
export default AlgorithmSelector;
```

#### Step 2.2: Update KeyPairGenerator

**Changes to `frontend/src/components/KeyPairGenerator.jsx`:**
1. Import AlgorithmSelector
2. Add algorithm state: `const [algorithm, setAlgorithm] = useState('RSA-2048')`
3. Pass algorithm to API: `await generateKeys(algorithm)`
4. Pass algorithm to parent: `onKeysGenerated(publicKey, privateKey, algorithm)`
5. Display algorithm-specific metadata (curve name, key size, capabilities)

#### Step 2.3: Update EncryptDecrypt

**Changes to `frontend/src/components/EncryptDecrypt.jsx`:**
1. Accept algorithm prop: `const EncryptDecrypt = ({ publicKey, privateKey, algorithm })`
2. Add capability check:
```javascript
const canEncrypt = algorithm?.startsWith('RSA') || false;

// Show helpful message if ECC selected
{!canEncrypt && (
  <div className="warning-message">
    ⚠️ {algorithm} does not support direct encryption.
    Only RSA algorithms support encryption/decryption.
    Consider using hybrid encryption (ECDH + AES).
  </div>
)}
```
3. Disable encryption/decryption sections if !canEncrypt

#### Step 2.4: Update DigitalSignature

**Changes to `frontend/src/components/DigitalSignature.jsx`:**
1. Accept algorithm prop
2. Pass algorithm to API: `await signMessage(algorithm, message, privateKey)`
3. Display algorithm-specific info (ECDSA vs EdDSA vs RSA-PSS)
4. Show curve name for ECC algorithms

#### Step 2.5: Create KeyExchange Component

**File: `frontend/src/components/KeyExchange.jsx`**
```javascript
import React, { useState } from 'react';
import { performKeyExchange } from '../services/cryptoApi';

const KeyExchange = ({ algorithm, publicKey, privateKey }) => {
  const [peerPublicKey, setPeerPublicKey] = useState('');
  const [sharedSecret, setSharedSecret] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const supportsECDH = ['P-256', 'P-384', 'P-521', 'secp256k1', 'X25519'].includes(algorithm);
  
  const handleKeyExchange = async () => {
    if (!peerPublicKey.trim()) {
      setError('Please enter peer public key');
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await performKeyExchange(algorithm, privateKey, peerPublicKey);
      setSharedSecret(response.sharedSecret);
    } catch (err) {
      setError(err.message);
      setSharedSecret('');
    } finally {
      setLoading(false);
    }
  };
  
  if (!supportsECDH) {
    return (
      <div className="card">
        <h3 className="text-xl font-bold mb-3">🔗 ECDH Key Exchange</h3>
        <div className="warning-message">
          ⚠️ {algorithm} does not support key exchange.
          Please use P-256, P-384, P-521, secp256k1, or X25519.
        </div>
      </div>
    );
  }
  
  return (
    <div className="card">
      <h3 className="text-xl font-bold mb-3">🔗 ECDH Key Exchange</h3>
      
      <p className="text-gray-600 mb-4">
        Perform Elliptic Curve Diffie-Hellman key exchange to derive a shared secret
        that can be used for symmetric encryption.
      </p>
      
      {error && (
        <div className="error-message mb-4">
          <strong>Error:</strong> {error}
        </div>
      )}
      
      <div className="space-y-4">
        {/* Your Public Key (for reference) */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Your Public Key (share with peer)
          </label>
          <textarea
            value={publicKey || 'Generate a key pair first'}
            readOnly
            rows={4}
            className="input-field bg-gray-50 text-xs"
          />
        </div>
        
        {/* Peer's Public Key */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Peer's Public Key
          </label>
          <textarea
            value={peerPublicKey}
            onChange={(e) => setPeerPublicKey(e.target.value)}
            placeholder="Paste the other party's public key here..."
            rows={4}
            className="input-field text-xs"
            disabled={!privateKey}
          />
        </div>
        
        {/* Exchange Button */}
        <button
          onClick={handleKeyExchange}
          disabled={loading || !privateKey || !peerPublicKey.trim()}
          className="btn-primary"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Computing...
            </span>
          ) : (
            '🔗 Generate Shared Secret'
          )}
        </button>
        
        {/* Shared Secret Output */}
        {sharedSecret && (
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Shared Secret (Base64)
            </label>
            <textarea
              value={sharedSecret}
              readOnly
              rows={3}
              className="input-field bg-green-50 border-green-300 text-xs"
            />
            <div className="info-message text-sm mt-3">
              <p className="font-semibold mb-2">💡 Using the Shared Secret:</p>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li>Both parties compute the same shared secret</li>
                <li>Use this secret as a key for symmetric encryption (AES)</li>
                <li>More efficient than RSA for large data</li>
                <li>Provides forward secrecy when keys are ephemeral</li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default KeyExchange;
```

#### Step 2.6: Create Algorithm Comparison

**File: `frontend/src/components/AlgorithmComparison.jsx`**
- Create comparison table
- Add use case recommendations
- Show performance characteristics
- Include security level information

### Phase 3: Service Layer Updates 🔌

#### Step 3.1: Update API Service

**File: `frontend/src/services/cryptoApi.js`**

Add algorithm parameters to all functions:

```javascript
export const generateKeys = async (algorithm = 'RSA-2048') => {
  const response = await api.post('/generate-keys', { algorithm });
  return response.data;
};

export const encryptMessage = async (message, publicKey, algorithm = 'RSA-2048') => {
  const response = await api.post('/encrypt', {
    algorithm,
    message,
    publicKey,
  });
  return response.data;
};

export const signMessage = async (algorithm, message, privateKey) => {
  const response = await api.post('/sign', {
    algorithm,
    message,
    privateKey,
  });
  return response.data;
};

export const performKeyExchange = async (algorithm, privateKey, peerPublicKey) => {
  const response = await api.post('/key-exchange', {
    algorithm,
    privateKey,
    peerPublicKey,
  });
  return response.data;
};
```

### Phase 4: Main App Updates 📱

#### Step 4.1: Update App.jsx

**File: `frontend/src/App.jsx`**

Add state management for algorithm:

```javascript
const [algorithm, setAlgorithm] = useState('RSA-2048');
const [publicKey, setPublicKey] = useState('');
const [privateKey, setPrivateKey] = useState('');

const handleKeysGenerated = (pubKey, privKey, algo) => {
  setPublicKey(pubKey);
  setPrivateKey(privKey);
  setAlgorithm(algo);
};

// Pass algorithm to all components
<KeyPairGenerator onKeysGenerated={handleKeysGenerated} />
<EncryptDecrypt 
  publicKey={publicKey} 
  privateKey={privateKey}
  algorithm={algorithm}
/>
<DigitalSignature
  publicKey={publicKey}
  privateKey={privateKey}
  algorithm={algorithm}
/>
<KeyExchange
  publicKey={publicKey}
  privateKey={privateKey}
  algorithm={algorithm}
/>
```

### Phase 5: Testing Plan 🧪

#### Backend Tests
1. **Key Generation:**
   - Test each algorithm generates valid PEM keys
   - Verify key sizes match specifications
   - Check capabilities metadata is correct

2. **RSA Operations:**
   - Test encryption/decryption for all RSA variants
   - Verify signature creation/verification
   - Test with various message sizes

3. **ECC Operations:**
   - Test ECDSA signing for all curves
   - Verify signature verification works
   - Test ECDH key exchange generates same shared secret

4. **Ed25519/X25519:**
   - Test EdDSA signatures
   - Test X25519 key exchange
   - Verify error handling for unsupported operations

#### Frontend Tests
1. **Component Rendering:**
   - Verify algorithm selector displays all options
   - Check capability badges show correctly
   - Test conditional rendering of operations

2. **User Workflows:**
   - Generate keys for each algorithm
   - Attempt encryption with ECC (should show error)
   - Create signatures with all signature algorithms
   - Perform key exchange with ECDH-capable algorithms

3. **Error Handling:**
   - Test with invalid keys
   - Test unsupported operations
   - Verify helpful error messages display

### Phase 6: Documentation Updates 📚

#### Files to Update

**README.md:**
- Update features list with all algorithms
- Add algorithm comparison table
- Include usage examples for each algorithm

**SETUP.md:**
- No changes needed (setup process remains same)

**PROJECT_SUMMARY.md:**
- Update feature list
- Add new algorithms section
- Update endpoint documentation

**Create NEW: ALGORITHM_GUIDE.md:**
- Detailed explanation of each algorithm
- When to use which algorithm
- Hybrid encryption guide
- Security considerations

## Implementation Checklist

### Backend
- [ ] Create `backend/src/controllers/algorithms/rsaAlgorithm.js`
- [ ] Create `backend/src/controllers/algorithms/eccAlgorithm.js`
- [ ] Create `backend/src/controllers/algorithms/ed25519Algorithm.js`
- [ ] Create `backend/src/controllers/algorithms/x25519Algorithm.js`
- [ ] Create `backend/src/utils/algorithmValidator.js`
- [ ] Update `backend/src/controllers/cryptoController.js`
- [ ] Update `backend/src/routes/crypto.js` (add /key-exchange)

### Frontend
- [ ] Create `frontend/src/components/AlgorithmSelector.jsx`
- [ ] Create `frontend/src/components/KeyExchange.jsx`
- [ ] Create `frontend/src/components/AlgorithmComparison.jsx`
- [ ] Update `frontend/src/components/KeyPairGenerator.jsx`
- [ ] Update `frontend/src/components/EncryptDecrypt.jsx`
- [ ] Update `frontend/src/components/DigitalSignature.jsx`
- [ ] Update `frontend/src/services/cryptoApi.js`
- [ ] Update `frontend/src/App.jsx`

### Documentation
- [ ] Update `README.md`
- [ ] Update `PROJECT_SUMMARY.md`
- [ ] Create `ALGORITHM_GUIDE.md`
- [ ] Update API endpoint documentation

### Testing
- [ ] Test all 9 algorithms generate keys
- [ ] Test RSA encryption (2048, 3072, 4096)
- [ ] Test ECDSA signatures (P-256, P-384, P-521, secp256k1)
- [ ] Test EdDSA signatures (Ed25519)
- [ ] Test ECDH key exchange (all ECC + X25519)
- [ ] Test error handling for unsupported operations
- [ ] End-to-end testing of all workflows

## Estimated Complexity

| Component | Complexity | Reason |
|-----------|------------|--------|
| Backend algorithms | Medium | Node.js crypto API well-documented |
| Algorithm routing | Low | Simple switch/case logic |
| ECDH implementation | Medium | Requires buffer handling |
| Frontend selector | Low | Standard React component |
| Conditional UI | Medium | Multiple capability checks |
| Key Exchange UI | Medium | New workflow to implement |
| Testing | High | Many algorithm combinations |

## Success Criteria

✅ User can select from 9 different algorithms
✅ Key generation works for all algorithms
✅ RSA encryption/decryption works (RSA only)
✅ Digital signatures work for all signature-capable algorithms
✅ ECDH key exchange works for all ECC curves + X25519
✅ UI clearly shows which operations each algorithm supports
✅ Error messages guide users when attempting unsupported operations
✅ Performance difference is noticeable (ECC faster than RSA)
✅ Documentation is complete and accurate

---

**Ready to implement?** Switch to Code mode to begin implementation following this roadmap.
