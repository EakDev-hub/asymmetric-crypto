import React from 'react';

const Header = () => {
  return (
    <header className="bg-gradient-to-r from-blue-600 to-blue-800 text-white shadow-lg">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">🔐 Asymmetric Cryptography</h1>
            <p className="text-blue-100 text-sm">
              Interactive demonstration of RSA encryption, decryption, and digital signatures
            </p>
          </div>
          <div className="text-right">
            <div className="text-sm text-blue-100">
              <p>RSA-2048</p>
              <p>SHA-256</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
