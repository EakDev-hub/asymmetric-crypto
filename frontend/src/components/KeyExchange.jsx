import React, { useState } from 'react';
import { performKeyExchange } from '../services/cryptoApi';

const KeyExchange = ({ publicKey, privateKey, algorithm = 'P-256' }) => {
  const [peerPublicKey, setPeerPublicKey] = useState('');
  const [sharedSecret, setSharedSecret] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [copied, setCopied] = useState(false);
  
  // Check if current algorithm supports key exchange
  const supportsECDH = ['P-256', 'P-384', 'P-521', 'secp256k1', 'X25519'].includes(algorithm);
  
  const handleKeyExchange = async () => {
    if (!supportsECDH) {
      setError(`${algorithm} does not support key exchange. Please use an ECC algorithm or X25519.`);
      return;
    }

    if (!peerPublicKey.trim()) {
      setError('Please enter peer public key');
      return;
    }

    if (!privateKey) {
      setError('Please generate a key pair first (Step 1)');
      return;
    }
    
    setLoading(true);
    setError(null);
    setSuccess(null);
    
    try {
      const response = await performKeyExchange(privateKey, peerPublicKey, algorithm);
      setSharedSecret(response.sharedSecret);
      setSuccess(`Shared secret generated successfully using ${response.algorithm}!`);
    } catch (err) {
      setError(err.message);
      setSharedSecret('');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const clearAll = () => {
    setPeerPublicKey('');
    setSharedSecret('');
    setError(null);
    setSuccess(null);
  };
  
  return (
    <div className="card">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">
        4️⃣ ECDH Key Exchange
      </h2>
      
      <p className="text-gray-600 mb-6">
        Perform Elliptic Curve Diffie-Hellman (ECDH) key exchange to derive a shared secret
        that both parties can use for symmetric encryption (like AES).
      </p>

      {/* Algorithm Info */}
      {algorithm && (
        <div className="mb-4 p-3 bg-teal-50 border border-teal-200 rounded-lg">
          <p className="text-sm">
            <span className="font-semibold text-teal-900">Current Algorithm:</span>
            <span className="ml-2 text-teal-700">{algorithm}</span>
            {supportsECDH ? (
              <span className="ml-2 text-xs text-teal-600">✅ Supports ECDH</span>
            ) : (
              <span className="ml-2 text-xs text-red-600">❌ Does not support ECDH</span>
            )}
          </p>
        </div>
      )}

      {/* Algorithm Warning for Non-ECDH */}
      {!supportsECDH && (
        <div className="mb-4 p-4 bg-yellow-50 border-2 border-yellow-400 rounded-lg">
          <div className="flex items-start gap-3">
            <span className="text-2xl">⚠️</span>
            <div>
              <p className="font-semibold text-yellow-900 mb-2">
                Key Exchange Not Supported with {algorithm}
              </p>
              <p className="text-sm text-yellow-800 mb-2">
                <strong>{algorithm}</strong> does not support ECDH key exchange. 
                Please use one of the following algorithms:
              </p>
              <ul className="text-sm text-yellow-800 list-disc list-inside ml-2">
                <li>P-256, P-384, P-521 (NIST curves)</li>
                <li>secp256k1 (Bitcoin curve)</li>
                <li>X25519 (Modern, optimized for key exchange)</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {error && (
        <div className="error-message mb-4">
          <strong>Error:</strong> {error}
        </div>
      )}

      {success && (
        <div className="success-message mb-4">
          {success}
        </div>
      )}
      
      <div className={`space-y-6 ${!supportsECDH ? 'opacity-50 pointer-events-none' : ''}`}>
        {/* Your Public Key (for reference) */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Your Public Key (share this with the other party)
          </label>
          <div className="flex gap-2">
            <textarea
              value={publicKey || 'Generate a key pair first (Step 1)'}
              readOnly
              rows={4}
              className="input-field bg-gray-50 text-xs flex-1"
            />
            <button
              onClick={() => copyToClipboard(publicKey)}
              disabled={!publicKey}
              className="btn-secondary px-3"
              title="Copy your public key"
            >
              {copied ? '✓' : '📋'}
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Share your public key with the other party so they can generate the same shared secret
          </p>
        </div>
        
        {/* Peer's Public Key */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Peer's Public Key
          </label>
          <textarea
            value={peerPublicKey}
            onChange={(e) => setPeerPublicKey(e.target.value)}
            placeholder="Paste the other party's public key here (PEM format)..."
            rows={4}
            className="input-field text-xs"
            disabled={!privateKey}
          />
          <p className="text-xs text-gray-500 mt-1">
            Enter the public key from the person you want to establish a shared secret with
          </p>
        </div>
        
        {/* Exchange Button */}
        <button
          onClick={handleKeyExchange}
          disabled={!supportsECDH || loading || !privateKey || !peerPublicKey.trim()}
          className="btn-primary w-full"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Computing Shared Secret...
            </span>
          ) : (
            '🔗 Generate Shared Secret'
          )}
        </button>
        
        {/* Shared Secret Output */}
        {sharedSecret && (
          <div className="p-4 bg-green-50 border-2 border-green-400 rounded-lg">
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-semibold text-green-900">
                Shared Secret (Base64)
              </label>
              <button
                onClick={() => copyToClipboard(sharedSecret)}
                className="text-xs text-green-700 hover:text-green-900 font-medium"
              >
                {copied ? '✓ Copied!' : '📋 Copy'}
              </button>
            </div>
            <textarea
              value={sharedSecret}
              readOnly
              rows={3}
              className="input-field bg-green-100 border-green-300 text-xs font-mono"
            />
            <div className="mt-3 p-3 bg-green-100 border border-green-300 rounded">
              <p className="text-xs font-semibold text-green-900 mb-2">
                ✅ Success! Both parties now have the same shared secret.
              </p>
              <p className="text-xs text-green-800">
                This secret can be used as a symmetric encryption key (e.g., with AES-256) 
                to encrypt large amounts of data efficiently. The beauty of ECDH is that 
                both parties derive the same secret without ever transmitting it!
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Info Section */}
      <div className="mt-6 space-y-4">
        <div className="info-message text-sm">
          <p className="font-semibold mb-2">💡 How ECDH Key Exchange Works:</p>
          <ul className="list-disc list-inside space-y-1 ml-2">
            <li><strong>Step 1:</strong> Alice and Bob each generate their own key pairs</li>
            <li><strong>Step 2:</strong> They exchange public keys (safe to share)</li>
            <li><strong>Step 3:</strong> Alice uses her private key + Bob's public key to derive shared secret</li>
            <li><strong>Step 4:</strong> Bob uses his private key + Alice's public key to derive the SAME secret</li>
            <li><strong>Result:</strong> Both have identical secret without ever transmitting it!</li>
            <li><strong>Use case:</strong> The shared secret becomes a symmetric key for AES encryption</li>
            <li><strong>Security:</strong> Even if an eavesdropper captures public keys, they cannot derive the secret</li>
          </ul>
        </div>

        <div className="bg-blue-50 border border-blue-300 rounded-lg p-4">
          <p className="text-sm font-semibold text-blue-800 mb-2">
            🔐 Hybrid Encryption Pattern:
          </p>
          <ol className="text-sm text-blue-900 list-decimal list-inside space-y-1 ml-2">
            <li>Use ECDH to derive a shared secret (fast, secure)</li>
            <li>Use the shared secret as an AES-256 key</li>
            <li>Encrypt large files/messages with AES (symmetric, very fast)</li>
            <li>This combines best of both: ECC security + AES speed</li>
          </ol>
          <p className="text-xs text-blue-700 mt-2">
            This is how modern protocols like TLS/SSL work!
          </p>
        </div>

        <button
          onClick={clearAll}
          className="btn-secondary"
        >
          🗑️ Clear All
        </button>
      </div>
    </div>
  );
};

export default KeyExchange;
