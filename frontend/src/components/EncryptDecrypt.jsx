import React, { useState, useEffect } from 'react';
import { encryptMessage, decryptMessage } from '../services/cryptoApi';

const EncryptDecrypt = ({ publicKey, privateKey, algorithm = 'RSA-2048' }) => {
  const [plainText, setPlainText] = useState('');
  const [encryptedText, setEncryptedText] = useState('');
  const [decryptedText, setDecryptedText] = useState('');
  
  const [encryptLoading, setEncryptLoading] = useState(false);
  const [decryptLoading, setDecryptLoading] = useState(false);
  
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  
  const [copied, setCopied] = useState(false);

  // Editable keys state
  const [editablePublicKey, setEditablePublicKey] = useState('');
  const [editablePrivateKey, setEditablePrivateKey] = useState('');

  // Check if current algorithm supports encryption
  const canEncrypt = algorithm?.startsWith('RSA') || false;

  // Sync editable keys with props when they change
  useEffect(() => {
    if (publicKey) {
      setEditablePublicKey(publicKey);
    }
  }, [publicKey]);

  useEffect(() => {
    if (privateKey) {
      setEditablePrivateKey(privateKey);
    }
  }, [privateKey]);

  const handleEncrypt = async () => {
    if (!canEncrypt) {
      setError(`${algorithm} does not support encryption. Please use an RSA algorithm.`);
      return;
    }

    if (!plainText.trim()) {
      setError('Please enter a message to encrypt');
      return;
    }

    if (!editablePublicKey) {
      setError('Please enter or generate a public key first');
      return;
    }

    setEncryptLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await encryptMessage(plainText, editablePublicKey, algorithm);
      setEncryptedText(response.encrypted);
      setSuccess(`Message encrypted successfully using ${response.algorithm}`);
    } catch (err) {
      setError(err.message);
      setEncryptedText('');
    } finally {
      setEncryptLoading(false);
    }
  };

  const handleDecrypt = async () => {
    if (!canEncrypt) {
      setError(`${algorithm} does not support decryption. Please use an RSA algorithm.`);
      return;
    }

    if (!encryptedText.trim()) {
      setError('Please enter encrypted data to decrypt');
      return;
    }

    if (!editablePrivateKey) {
      setError('Please enter or generate a private key first');
      return;
    }

    setDecryptLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await decryptMessage(encryptedText, editablePrivateKey, algorithm);
      setDecryptedText(response.decrypted);
      setSuccess('Message decrypted successfully!');
    } catch (err) {
      setError(err.message);
      setDecryptedText('');
    } finally {
      setDecryptLoading(false);
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
    setPlainText('');
    setEncryptedText('');
    setDecryptedText('');
    setError(null);
    setSuccess(null);
  };

  return (
    <div className="card">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">
        2️⃣ Encrypt & Decrypt Messages
      </h2>

      <p className="text-gray-600 mb-6">
        Use the public key to encrypt a message, then use the private key to decrypt it.
        Only the holder of the private key can decrypt messages encrypted with the public key.
      </p>

      {/* Algorithm Warning for Non-RSA */}
      {!canEncrypt && (
        <div className="mb-4 p-4 bg-yellow-50 border-2 border-yellow-400 rounded-lg">
          <div className="flex items-start gap-3">
            <span className="text-2xl">⚠️</span>
            <div>
              <p className="font-semibold text-yellow-900 mb-2">
                Encryption Not Supported with {algorithm}
              </p>
              <p className="text-sm text-yellow-800 mb-2">
                <strong>{algorithm}</strong> does not support direct encryption/decryption.
                Only RSA algorithms support this feature.
              </p>
              <p className="text-sm text-yellow-800">
                <strong>Alternative:</strong> For ECC algorithms, use the Key Exchange feature
                to derive a shared secret, then use that with symmetric encryption (AES).
              </p>
            </div>
          </div>
        </div>
      )}

      {error && (
        <div className="error-message">
          <strong>Error:</strong> {error}
        </div>
      )}

      {success && (
        <div className="success-message">
          {success}
        </div>
      )}

      <div className={`grid grid-cols-1 lg:grid-cols-2 gap-6 ${!canEncrypt ? 'opacity-50 pointer-events-none' : ''}`}>
        {/* Encryption Section */}
        <div className="space-y-4">
          <div className="bg-green-50 border-2 border-green-200 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-green-800 mb-3 flex items-center gap-2">
              <span>🔒</span>
              <span>Encryption</span>
            </h3>

            {/* Plain Text Input */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Plain Text Message
              </label>
              <textarea
                value={plainText}
                onChange={(e) => setPlainText(e.target.value)}
                placeholder="Enter your secret message here... (max ~245 characters for 2048-bit RSA)"
                rows={4}
                className="input-field"
                maxLength={245}
              />
              <p className="text-xs text-gray-500 mt-1">
                {plainText.length} / 245 characters
              </p>
            </div>

            {/* Public Key Input */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-gray-700 flex items-center gap-2">
                  Public Key (for encryption)
                  <span className="text-xs text-blue-600 font-normal">✏️ Editable</span>
                </label>
                {publicKey && (
                  <button
                    onClick={() => setEditablePublicKey(publicKey)}
                    className="text-xs text-blue-600 hover:text-blue-800"
                    title="Restore generated key"
                  >
                    🔄 Restore
                  </button>
                )}
              </div>
              <textarea
                value={editablePublicKey}
                onChange={(e) => setEditablePublicKey(e.target.value)}
                placeholder="Enter or paste public key (PEM format) or generate keys in Step 1..."
                rows={4}
                className="input-field text-xs"
              />
              <p className="text-xs text-gray-500 mt-1">
                You can manually edit this key or use the generated one
              </p>
            </div>

            {/* Encrypt Button */}
            <button
              onClick={handleEncrypt}
              disabled={!canEncrypt || encryptLoading || !editablePublicKey || !plainText.trim()}
              className="btn-primary w-full"
            >
              {encryptLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Encrypting...
                </span>
              ) : (
                '🔒 Encrypt Message'
              )}
            </button>

            {/* Encrypted Output */}
            {encryptedText && (
              <div className="mt-4">
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Encrypted Data (Base64)
                  </label>
                  <button
                    onClick={() => copyToClipboard(encryptedText)}
                    className="text-xs text-blue-600 hover:text-blue-800"
                  >
                    {copied ? '✓ Copied!' : '📋 Copy'}
                  </button>
                </div>
                <textarea
                  value={encryptedText}
                  readOnly
                  rows={6}
                  className="input-field bg-yellow-50 border-yellow-300 text-xs break-all"
                />
              </div>
            )}
          </div>

          {/* Visual Flow Arrow */}
          <div className="flex justify-center">
            <div className="text-center">
              <div className="text-4xl animate-pulse">⬇️</div>
              <p className="text-sm text-gray-600 mt-1">Encryption Flow</p>
            </div>
          </div>
        </div>

        {/* Decryption Section */}
        <div className="space-y-4">
          <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-blue-800 mb-3 flex items-center gap-2">
              <span>🔓</span>
              <span>Decryption</span>
            </h3>

            {/* Encrypted Text Input */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Encrypted Data (Base64)
              </label>
              <textarea
                value={encryptedText}
                onChange={(e) => setEncryptedText(e.target.value)}
                placeholder="Paste encrypted data here or encrypt a message first..."
                rows={6}
                className="input-field text-xs"
              />
            </div>

            {/* Private Key Input */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-gray-700 flex items-center gap-2">
                  Private Key (for decryption)
                  <span className="text-xs text-blue-600 font-normal">✏️ Editable</span>
                </label>
                {privateKey && (
                  <button
                    onClick={() => setEditablePrivateKey(privateKey)}
                    className="text-xs text-blue-600 hover:text-blue-800"
                    title="Restore generated key"
                  >
                    🔄 Restore
                  </button>
                )}
              </div>
              <textarea
                value={editablePrivateKey}
                onChange={(e) => setEditablePrivateKey(e.target.value)}
                placeholder="Enter or paste private key (PEM format) or generate keys in Step 1..."
                rows={4}
                className="input-field text-xs"
              />
              <p className="text-xs text-gray-500 mt-1">
                You can manually edit this key or use the generated one
              </p>
            </div>

            {/* Decrypt Button */}
            <button
              onClick={handleDecrypt}
              disabled={!canEncrypt || decryptLoading || !editablePrivateKey || !encryptedText.trim()}
              className="btn-primary w-full"
            >
              {decryptLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Decrypting...
                </span>
              ) : (
                '🔓 Decrypt Message'
              )}
            </button>

            {/* Decrypted Output */}
            {decryptedText && (
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Decrypted Message
                </label>
                <textarea
                  value={decryptedText}
                  readOnly
                  rows={4}
                  className="input-field bg-green-50 border-green-300"
                />
              </div>
            )}
          </div>

          {/* Visual Flow Arrow */}
          <div className="flex justify-center">
            <div className="text-center">
              <div className="text-4xl animate-pulse">⬇️</div>
              <p className="text-sm text-gray-600 mt-1">Decryption Flow</p>
            </div>
          </div>
        </div>
      </div>

      {/* Info and Actions */}
      <div className="mt-6 space-y-4">
        <div className="info-message text-sm">
          <p className="font-semibold mb-2">💡 How Encryption/Decryption Works:</p>
          <ul className="list-disc list-inside space-y-1 ml-2">
            <li><strong>Encryption:</strong> Plain text + Public Key = Encrypted Data (anyone can encrypt)</li>
            <li><strong>Decryption:</strong> Encrypted Data + Private Key = Original Message (only private key holder can decrypt)</li>
            <li>The encrypted data is encoded in Base64 format for easy transmission</li>
            <li><strong>RSA only:</strong> RSA-OAEP padding is used for security against certain attacks</li>
            <li><strong>Message limits:</strong> RSA-2048 (~245 bytes), RSA-3072 (~381 bytes), RSA-4096 (~501 bytes)</li>
            <li><strong>ECC note:</strong> ECC curves don't support direct encryption. Use ECDH + AES instead.</li>
          </ul>
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

export default EncryptDecrypt;
