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
    id: 'RSA-4096',
    name: 'RSA-4096',
    category: 'RSA',
    description: 'Maximum RSA security (4096-bit)',
    icon: '🔐',
    capabilities: ['encrypt', 'decrypt', 'sign', 'verify'],
    speed: '⚡',
    security: '🛡️🛡️🛡️🛡️🛡️'
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
    description: 'Key exchange only (Curve25519)',
    icon: '🔗',
    capabilities: ['ecdh'],
    speed: '⚡⚡⚡⚡⚡',
    security: '🛡️🛡️🛡️🛡️'
  }
];

const AlgorithmSelector = ({ value, onChange, className = '' }) => {
  const selectedAlgo = ALGORITHMS.find(a => a.id === value);
  
  return (
    <div className={`space-y-3 ${className}`}>
      <label className="block text-sm font-medium text-gray-700">
        Select Cryptographic Algorithm
      </label>
      
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="input-field text-sm"
      >
        <optgroup label="🔐 RSA (Traditional - Supports Encryption)">
          {ALGORITHMS.filter(a => a.category === 'RSA').map(algo => (
            <option key={algo.id} value={algo.id}>
              {algo.icon} {algo.name} - {algo.description}
            </option>
          ))}
        </optgroup>
        
        <optgroup label="🔑 ECC (Elliptic Curve - Fast Signatures)">
          {ALGORITHMS.filter(a => a.category === 'ECC').map(algo => (
            <option key={algo.id} value={algo.id}>
              {algo.icon} {algo.name} - {algo.description}
            </option>
          ))}
        </optgroup>
        
        <optgroup label="⚡ Modern Curves (Optimized Performance)">
          {ALGORITHMS.filter(a => a.category === 'Modern').map(algo => (
            <option key={algo.id} value={algo.id}>
              {algo.icon} {algo.name} - {algo.description}
            </option>
          ))}
        </optgroup>
      </select>
      
      {selectedAlgo && (
        <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg">
          <div className="flex items-start gap-3">
            <span className="text-3xl">{selectedAlgo.icon}</span>
            <div className="flex-1">
              <p className="text-sm font-semibold text-blue-900 mb-2">
                {selectedAlgo.name}
              </p>
              <div className="grid grid-cols-2 gap-2 text-xs mb-3">
                <div className="flex items-center gap-1">
                  <span className="font-medium text-gray-700">Speed:</span>
                  <span>{selectedAlgo.speed}</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="font-medium text-gray-700">Security:</span>
                  <span>{selectedAlgo.security}</span>
                </div>
              </div>
              <div>
                <span className="font-medium text-xs text-gray-700">Capabilities:</span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {selectedAlgo.capabilities.map(cap => (
                    <span 
                      key={cap} 
                      className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium"
                    >
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
          </div>
        </div>
      )}
    </div>
  );
};

// Export algorithms for use in other components
export { ALGORITHMS };
export default AlgorithmSelector;
