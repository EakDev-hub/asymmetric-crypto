import React, { useState } from 'react';
import { signMessage, verifySignature } from '../services/cryptoApi';

const DigitalSignature = ({ publicKey, privateKey }) => {
  const [messageToSign, setMessageToSign] = useState('');
  const [signature, setSignature] = useState('');
  
  const [messageToVerify, setMessageToVerify] = useState('');
  const [signatureToVerify, setSignatureToVerify] = useState('');
  const [verificationResult, setVerificationResult] = useState(null);
  
  const [signLoading, setSignLoading] = useState(false);
  const [verifyLoading, setVerifyLoading] = useState(false);
  
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  
  const [copied, setCopied] = useState(false);

  const handleSign = async () => {
    if (!messageToSign.trim()) {
      setError('Please enter a message to sign');
      return;
    }

    if (!privateKey) {
      setError('Please generate a key pair first (Step 1)');
      return;
    }

    setSignLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await signMessage(messageToSign, privateKey);
      setSignature(response.signature);
      setSignatureToVerify(response.signature);
      setMessageToVerify(messageToSign);
      setSuccess(`Message signed successfully using ${response.algorithm}`);
    } catch (err) {
      setError(err.message);
      setSignature('');
    } finally {
      setSignLoading(false);
    }
  };

  const handleVerify = async () => {
    if (!messageToVerify.trim()) {
      setError('Please enter the original message');
      return;
    }

    if (!signatureToVerify.trim()) {
      setError('Please enter the signature to verify');
      return;
    }

    if (!publicKey) {
      setError('Please generate a key pair first (Step 1)');
      return;
    }

    setVerifyLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await verifySignature(messageToVerify, signatureToVerify, publicKey);
      setVerificationResult(response.verified);
      
      if (response.verified) {
        setSuccess('✅ Signature is VALID! Message is authentic and hasn\'t been tampered with.');
      } else {
        setError('❌ Signature is INVALID! Message may have been modified or signature is incorrect.');
      }
    } catch (err) {
      setError(err.message);
      setVerificationResult(null);
    } finally {
      setVerifyLoading(false);
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
    setMessageToSign('');
    setSignature('');
    setMessageToVerify('');
    setSignatureToVerify('');
    setVerificationResult(null);
    setError(null);
    setSuccess(null);
  };

  return (
    <div className="card">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">
        3️⃣ Digital Signatures
      </h2>

      <p className="text-gray-600 mb-6">
        Create a digital signature using your private key to prove message authenticity.
        Anyone with your public key can verify the signature to confirm you signed it.
      </p>

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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Signing Section */}
        <div className="space-y-4">
          <div className="bg-purple-50 border-2 border-purple-200 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-purple-800 mb-3 flex items-center gap-2">
              <span>✍️</span>
              <span>Create Signature</span>
            </h3>

            {/* Message Input */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Message to Sign
              </label>
              <textarea
                value={messageToSign}
                onChange={(e) => setMessageToSign(e.target.value)}
                placeholder="Enter the message you want to sign..."
                rows={4}
                className="input-field"
              />
            </div>

            {/* Private Key Display */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Private Key (for signing)
              </label>
              <textarea
                value={privateKey || 'Generate keys first...'}
                readOnly
                rows={4}
                className="input-field bg-gray-50 text-xs"
              />
            </div>

            {/* Sign Button */}
            <button
              onClick={handleSign}
              disabled={signLoading || !privateKey || !messageToSign.trim()}
              className="btn-primary w-full"
            >
              {signLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Signing...
                </span>
              ) : (
                '✍️ Sign Message'
              )}
            </button>

            {/* Signature Output */}
            {signature && (
              <div className="mt-4">
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Digital Signature (Base64)
                  </label>
                  <button
                    onClick={() => copyToClipboard(signature)}
                    className="text-xs text-blue-600 hover:text-blue-800"
                  >
                    {copied ? '✓ Copied!' : '📋 Copy'}
                  </button>
                </div>
                <textarea
                  value={signature}
                  readOnly
                  rows={6}
                  className="input-field bg-purple-100 border-purple-300 text-xs break-all"
                />
              </div>
            )}
          </div>

          {/* Visual Flow Arrow */}
          <div className="flex justify-center">
            <div className="text-center">
              <div className="text-4xl animate-pulse">⬇️</div>
              <p className="text-sm text-gray-600 mt-1">Signing Process</p>
            </div>
          </div>
        </div>

        {/* Verification Section */}
        <div className="space-y-4">
          <div className="bg-indigo-50 border-2 border-indigo-200 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-indigo-800 mb-3 flex items-center gap-2">
              <span>✅</span>
              <span>Verify Signature</span>
            </h3>

            {/* Original Message Input */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Original Message
              </label>
              <textarea
                value={messageToVerify}
                onChange={(e) => setMessageToVerify(e.target.value)}
                placeholder="Enter the original message..."
                rows={4}
                className="input-field"
              />
            </div>

            {/* Signature Input */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Signature (Base64)
              </label>
              <textarea
                value={signatureToVerify}
                onChange={(e) => setSignatureToVerify(e.target.value)}
                placeholder="Paste the signature here or sign a message first..."
                rows={4}
                className="input-field text-xs"
              />
            </div>

            {/* Public Key Display */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Public Key (for verification)
              </label>
              <textarea
                value={publicKey || 'Generate keys first...'}
                readOnly
                rows={4}
                className="input-field bg-gray-50 text-xs"
              />
            </div>

            {/* Verify Button */}
            <button
              onClick={handleVerify}
              disabled={verifyLoading || !publicKey || !messageToVerify.trim() || !signatureToVerify.trim()}
              className="btn-primary w-full"
            >
              {verifyLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Verifying...
                </span>
              ) : (
                '✅ Verify Signature'
              )}
            </button>

            {/* Verification Result */}
            {verificationResult !== null && (
              <div className={`mt-4 p-4 rounded-lg ${
                verificationResult 
                  ? 'bg-green-100 border-2 border-green-400' 
                  : 'bg-red-100 border-2 border-red-400'
              }`}>
                <div className="flex items-center gap-3">
                  <div className="text-4xl">
                    {verificationResult ? '✅' : '❌'}
                  </div>
                  <div>
                    <p className={`font-bold ${
                      verificationResult ? 'text-green-800' : 'text-red-800'
                    }`}>
                      {verificationResult ? 'SIGNATURE VALID' : 'SIGNATURE INVALID'}
                    </p>
                    <p className={`text-sm ${
                      verificationResult ? 'text-green-700' : 'text-red-700'
                    }`}>
                      {verificationResult 
                        ? 'The message is authentic and has not been tampered with.'
                        : 'The signature does not match the message or public key.'
                      }
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Visual Flow Arrow */}
          <div className="flex justify-center">
            <div className="text-center">
              <div className="text-4xl animate-pulse">⬇️</div>
              <p className="text-sm text-gray-600 mt-1">Verification Process</p>
            </div>
          </div>
        </div>
      </div>

      {/* Info and Actions */}
      <div className="mt-6 space-y-4">
        <div className="info-message text-sm">
          <p className="font-semibold mb-2">💡 How Digital Signatures Work:</p>
          <ul className="list-disc list-inside space-y-1 ml-2">
            <li><strong>Signing:</strong> Message is hashed (SHA-256) and encrypted with private key = Digital Signature</li>
            <li><strong>Verification:</strong> Signature is decrypted with public key and compared to message hash</li>
            <li><strong>Authenticity:</strong> Proves the message was signed by the private key owner</li>
            <li><strong>Integrity:</strong> Confirms the message hasn't been altered since signing</li>
            <li><strong>Non-repudiation:</strong> Signer cannot deny creating the signature</li>
            <li>Changing even one character in the message will make verification fail</li>
          </ul>
        </div>

        {/* Test Tampering */}
        <div className="bg-yellow-50 border border-yellow-300 rounded-lg p-4">
          <p className="text-sm font-semibold text-yellow-800 mb-2">
            🧪 Try This Experiment:
          </p>
          <ol className="text-sm text-yellow-900 list-decimal list-inside space-y-1 ml-2">
            <li>Sign a message</li>
            <li>Copy the signature</li>
            <li>Change just one character in the "Original Message" field</li>
            <li>Verify the signature - it will fail!</li>
          </ol>
          <p className="text-xs text-yellow-700 mt-2">
            This demonstrates how digital signatures detect any tampering with the message.
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

export default DigitalSignature;
