import React, { useState } from 'react';
import { generateKeys } from '../services/cryptoApi';

const KeyPairGenerator = ({ onKeysGenerated }) => {
  const [loading, setLoading] = useState(false);
  const [keys, setKeys] = useState(null);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState({ public: false, private: false });

  const handleGenerateKeys = async () => {
    setLoading(true);
    setError(null);
    setCopied({ public: false, private: false });

    try {
      const response = await generateKeys();
      setKeys({
        publicKey: response.publicKey,
        privateKey: response.privateKey,
        keySize: response.keySize,
        algorithm: response.algorithm
      });
      
      // Pass keys up to parent component
      if (onKeysGenerated) {
        onKeysGenerated(response.publicKey, response.privateKey);
      }
    } catch (err) {
      setError(err.message);
      setKeys(null);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async (text, type) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(prev => ({ ...prev, [type]: true }));
      setTimeout(() => {
        setCopied(prev => ({ ...prev, [type]: false }));
      }, 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <div className="card">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">
        1️⃣ Generate RSA Key Pair
      </h2>
      
      <div className="mb-6">
        <p className="text-gray-600 mb-4">
          Generate a pair of cryptographically linked keys. The public key can be shared with anyone,
          while the private key must be kept secret.
        </p>
        
        <button
          onClick={handleGenerateKeys}
          disabled={loading}
          className="btn-primary flex items-center gap-2"
        >
          {loading ? (
            <>
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              <span>Generating Keys...</span>
            </>
          ) : (
            <>
              <span>🔑</span>
              <span>Generate New Key Pair</span>
            </>
          )}
        </button>
      </div>

      {error && (
        <div className="error-message">
          <strong>Error:</strong> {error}
        </div>
      )}

      {keys && (
        <div className="space-y-6">
          <div className="success-message">
            ✅ Successfully generated {keys.keySize}-bit {keys.algorithm} key pair!
          </div>

          {/* Public Key */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-semibold text-gray-700">
                🔓 Public Key
                <span className="ml-2 text-xs font-normal text-gray-500">
                  (Safe to share - used for encryption and signature verification)
                </span>
              </label>
              <button
                onClick={() => copyToClipboard(keys.publicKey, 'public')}
                className="text-sm text-blue-600 hover:text-blue-800 font-medium"
              >
                {copied.public ? '✓ Copied!' : '📋 Copy'}
              </button>
            </div>
            <textarea
              value={keys.publicKey}
              readOnly
              rows={8}
              className="input-field bg-green-50 border-green-300"
            />
          </div>

          {/* Private Key */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-semibold text-gray-700">
                🔐 Private Key
                <span className="ml-2 text-xs font-normal text-red-600">
                  (Keep secret - used for decryption and signing)
                </span>
              </label>
              <button
                onClick={() => copyToClipboard(keys.privateKey, 'private')}
                className="text-sm text-blue-600 hover:text-blue-800 font-medium"
              >
                {copied.private ? '✓ Copied!' : '📋 Copy'}
              </button>
            </div>
            <textarea
              value={keys.privateKey}
              readOnly
              rows={16}
              className="input-field bg-red-50 border-red-300"
            />
          </div>

          {/* Info Box */}
          <div className="info-message text-sm">
            <p className="font-semibold mb-2">💡 How it works:</p>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li>These keys are mathematically linked but cannot be derived from each other</li>
              <li>Data encrypted with the public key can only be decrypted with the private key</li>
              <li>Signatures created with the private key can be verified with the public key</li>
              <li>The private key must never be shared or transmitted</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default KeyPairGenerator;
