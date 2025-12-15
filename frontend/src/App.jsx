import React, { useState } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import KeyPairGenerator from './components/KeyPairGenerator';
import EncryptDecrypt from './components/EncryptDecrypt';
import DigitalSignature from './components/DigitalSignature';
import KeyExchange from './components/KeyExchange';
import ProcessVisualization from './components/ProcessVisualization';

function App() {
  const [publicKey, setPublicKey] = useState('');
  const [privateKey, setPrivateKey] = useState('');
  const [algorithm, setAlgorithm] = useState('RSA-2048');
  const [activeTab, setActiveTab] = useState('overview');

  const handleKeysGenerated = (pubKey, privKey, algo) => {
    setPublicKey(pubKey);
    setPrivateKey(privKey);
    setAlgorithm(algo);
  };

  const tabs = [
    { id: 'overview', label: '📚 Overview', icon: '📚' },
    { id: 'operations', label: '🔧 Operations', icon: '🔧' },
    { id: 'visualization', label: '👁️ How It Works', icon: '👁️' },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        {/* Tab Navigation */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-2 border-b border-gray-200">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-3 font-semibold transition-all ${
                  activeTab === tab.id
                    ? 'border-b-2 border-blue-500 text-blue-600 bg-blue-50'
                    : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="card">
              <h2 className="text-2xl font-bold mb-4 text-gray-800">
                Welcome to Multi-Algorithm Cryptography Demo
              </h2>
              <p className="text-gray-700 mb-4">
                This interactive application demonstrates how asymmetric (public-key) cryptography works using multiple algorithms
                including RSA, ECC (Elliptic Curve), Ed25519, and X25519. You'll learn about key generation, encryption, decryption,
                digital signatures, and key exchange through hands-on experimentation.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="text-3xl mb-2">🔑</div>
                  <h3 className="font-semibold text-green-800 mb-2">Key Generation</h3>
                  <p className="text-sm text-gray-700">
                    Generate key pairs using RSA, ECC, Ed25519, or X25519 algorithms.
                  </p>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="text-3xl mb-2">🔒</div>
                  <h3 className="font-semibold text-blue-800 mb-2">Encryption/Decryption</h3>
                  <p className="text-sm text-gray-700">
                    Encrypt messages with RSA public keys (ECC uses key exchange instead).
                  </p>
                </div>

                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                  <div className="text-3xl mb-2">✍️</div>
                  <h3 className="font-semibold text-purple-800 mb-2">Digital Signatures</h3>
                  <p className="text-sm text-gray-700">
                    Sign with RSA, ECDSA, or EdDSA for message authenticity.
                  </p>
                </div>

                <div className="bg-teal-50 border border-teal-200 rounded-lg p-4">
                  <div className="text-3xl mb-2">🔗</div>
                  <h3 className="font-semibold text-teal-800 mb-2">Key Exchange</h3>
                  <p className="text-sm text-gray-700">
                    Use ECDH to derive shared secrets for symmetric encryption.
                  </p>
                </div>
              </div>
            </div>

            <div className="card bg-gradient-to-r from-blue-50 to-purple-50">
              <h3 className="text-xl font-bold mb-3 text-gray-800">🎓 Quick Start Guide</h3>
              <ol className="space-y-3">
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold">1</span>
                  <div>
                    <strong>Choose Algorithm & Generate Keys:</strong> Select an algorithm (RSA, ECC, Ed25519, X25519) and generate your key pair.
                  </div>
                </li>
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold">2</span>
                  <div>
                    <strong>Try Encryption:</strong> Type a message, encrypt it with the public key, then decrypt with the private key.
                  </div>
                </li>
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold">3</span>
                  <div>
                    <strong>Test Signatures:</strong> Sign a message and verify the signature to see how digital signatures prove authenticity.
                  </div>
                </li>
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold">4</span>
                  <div>
                    <strong>Experiment:</strong> Try tampering with encrypted data or signed messages to see how cryptography detects changes!
                  </div>
                </li>
              </ol>
            </div>

            <div className="bg-yellow-50 border border-yellow-300 rounded-lg p-4">
              <h4 className="font-semibold text-yellow-800 mb-2">⚠️ Important Notice</h4>
              <ul className="text-sm text-yellow-900 space-y-1 list-disc list-inside">
                <li>This is an <strong>educational demonstration</strong> only</li>
                <li>Do not use this for protecting real sensitive data</li>
                <li>Keys are stored only in browser memory and will be lost on page refresh</li>
                <li>For real-world applications, use established cryptographic libraries and secure key management</li>
              </ul>
            </div>
          </div>
        )}

        {/* Operations Tab */}
        {activeTab === 'operations' && (
          <div className="space-y-6">
            <KeyPairGenerator onKeysGenerated={handleKeysGenerated} />
            <EncryptDecrypt publicKey={publicKey} privateKey={privateKey} algorithm={algorithm} />
            <DigitalSignature publicKey={publicKey} privateKey={privateKey} algorithm={algorithm} />
            <KeyExchange publicKey={publicKey} privateKey={privateKey} algorithm={algorithm} />
          </div>
        )}

        {/* Visualization Tab */}
        {activeTab === 'visualization' && (
          <div className="space-y-6">
            <div className="card">
              <h2 className="text-2xl font-bold mb-4 text-gray-800">
                Understanding the Cryptographic Process
              </h2>
              <p className="text-gray-700 mb-6">
                These visualizations show the step-by-step process of each cryptographic operation.
                Each step is crucial for the security and functionality of asymmetric cryptography.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold mb-3 text-gray-800">Key Generation Process</h3>
                <ProcessVisualization type="keygen" />
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-3 text-gray-800">Encryption Process</h3>
                <ProcessVisualization type="encrypt" />
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-3 text-gray-800">Decryption Process</h3>
                <ProcessVisualization type="decrypt" />
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-3 text-gray-800">Signing Process</h3>
                <ProcessVisualization type="sign" />
              </div>

              <div className="lg:col-span-2">
                <h3 className="text-lg font-semibold mb-3 text-gray-800">Verification Process</h3>
                <ProcessVisualization type="verify" />
              </div>
            </div>

            <div className="card bg-gradient-to-r from-indigo-50 to-blue-50">
              <h3 className="text-xl font-bold mb-4 text-gray-800">🔐 Core Concepts</h3>
              
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">Public Key (Can be shared)</h4>
                  <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
                    <li>Used to <strong>encrypt</strong> messages that only the private key can decrypt</li>
                    <li>Used to <strong>verify</strong> signatures created with the private key</li>
                    <li>Safe to distribute publicly - cannot be used to decrypt or forge signatures</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">Private Key (Must be secret)</h4>
                  <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
                    <li>Used to <strong>decrypt</strong> messages encrypted with the public key</li>
                    <li>Used to <strong>sign</strong> messages to prove authenticity</li>
                    <li>Must never be shared - possession proves identity</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">Why It's Secure</h4>
                  <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
                    <li>Based on mathematical problems that are easy one way but hard to reverse</li>
                    <li>RSA security relies on the difficulty of factoring large numbers</li>
                    <li>2048-bit keys provide strong security for most applications</li>
                    <li>Padding schemes (OAEP) prevent various cryptographic attacks</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

export default App;
