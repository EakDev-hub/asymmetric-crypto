import React from 'react';

const ProcessVisualization = ({ type, currentStep = 0 }) => {
  const processes = {
    keygen: [
      { icon: '🎲', title: 'Generate Random Primes', description: 'Create two large prime numbers (p and q)' },
      { icon: '🔢', title: 'Calculate Modulus', description: 'Compute n = p × q (2048-bit number)' },
      { icon: '🔑', title: 'Create Public Key', description: 'Public exponent (e) and modulus (n)' },
      { icon: '🔐', title: 'Create Private Key', description: 'Private exponent (d) and modulus (n)' },
      { icon: '📄', title: 'Export Keys', description: 'Format keys as PEM for use' },
    ],
    encrypt: [
      { icon: '📝', title: 'Plain Text', description: 'Original message to encrypt' },
      { icon: '🔢', title: 'Convert to Numbers', description: 'Encode text to numerical values' },
      { icon: '🧮', title: 'Apply OAEP Padding', description: 'Add padding for security' },
      { icon: '🔒', title: 'Encrypt with Public Key', description: 'Mathematical transformation' },
      { icon: '📦', title: 'Encode Base64', description: 'Convert to transmittable format' },
    ],
    decrypt: [
      { icon: '📦', title: 'Encrypted Data', description: 'Received Base64 encrypted data' },
      { icon: '🔓', title: 'Decode Base64', description: 'Convert back to binary' },
      { icon: '🔐', title: 'Decrypt with Private Key', description: 'Reverse the encryption' },
      { icon: '🧮', title: 'Remove Padding', description: 'Strip OAEP padding' },
      { icon: '📝', title: 'Plain Text', description: 'Original message recovered' },
    ],
    sign: [
      { icon: '📝', title: 'Message', description: 'Original message to sign' },
      { icon: '#️⃣', title: 'Hash Message', description: 'Create SHA-256 hash' },
      { icon: '🔐', title: 'Encrypt Hash', description: 'Encrypt with private key' },
      { icon: '✍️', title: 'Create Signature', description: 'Generate digital signature' },
      { icon: '📦', title: 'Encode Base64', description: 'Format for transmission' },
    ],
    verify: [
      { icon: '📝', title: 'Original Message', description: 'Message to verify' },
      { icon: '#️⃣', title: 'Hash Message', description: 'Create SHA-256 hash' },
      { icon: '📦', title: 'Decode Signature', description: 'Decode from Base64' },
      { icon: '🔓', title: 'Decrypt Signature', description: 'Decrypt with public key' },
      { icon: '✅', title: 'Compare Hashes', description: 'Valid if hashes match' },
    ],
  };

  const steps = processes[type] || [];

  return (
    <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg p-6 border border-gray-200">
      <h3 className="text-lg font-semibold mb-4 text-gray-800 flex items-center gap-2">
        <span>🔄</span>
        <span>Process Visualization</span>
      </h3>
      
      <div className="space-y-3">
        {steps.map((step, index) => (
          <div key={index}>
            <div className={`flex items-start gap-4 p-3 rounded-lg transition-all ${
              index === currentStep 
                ? 'bg-blue-100 border-2 border-blue-400 shadow-md' 
                : 'bg-white border border-gray-200'
            }`}>
              <div className={`text-3xl ${index === currentStep ? 'animate-pulse' : ''}`}>
                {step.icon}
              </div>
              <div className="flex-1">
                <h4 className={`font-semibold ${
                  index === currentStep ? 'text-blue-800' : 'text-gray-700'
                }`}>
                  {step.title}
                </h4>
                <p className="text-sm text-gray-600">
                  {step.description}
                </p>
              </div>
              <div className="text-sm font-mono text-gray-400">
                {index + 1}/{steps.length}
              </div>
            </div>
            
            {index < steps.length - 1 && (
              <div className="flex justify-center py-1">
                <div className="text-2xl text-gray-400">↓</div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProcessVisualization;
