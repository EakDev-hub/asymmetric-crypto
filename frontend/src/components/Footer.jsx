import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-gray-300 mt-12">
      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <h3 className="text-white font-semibold mb-2">About This Demo</h3>
            <p className="text-sm">
              An educational tool demonstrating asymmetric cryptography using RSA algorithm.
              Built with React and Node.js.
            </p>
          </div>
          
          <div>
            <h3 className="text-white font-semibold mb-2">⚠️ Important</h3>
            <ul className="text-sm space-y-1">
              <li>• Educational purposes only</li>
              <li>• Do not use for real sensitive data</li>
              <li>• Keys are not stored persistently</li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-white font-semibold mb-2">Learn More</h3>
            <ul className="text-sm space-y-1">
              <li>
                <a 
                  href="https://en.wikipedia.org/wiki/RSA_(cryptosystem)" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:text-blue-300"
                >
                  RSA Algorithm →
                </a>
              </li>
              <li>
                <a 
                  href="https://en.wikipedia.org/wiki/Public-key_cryptography" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:text-blue-300"
                >
                  Public-Key Cryptography →
                </a>
              </li>
              <li>
                <a 
                  href="https://en.wikipedia.org/wiki/Digital_signature" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:text-blue-300"
                >
                  Digital Signatures →
                </a>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-700 mt-6 pt-4 text-center text-sm">
          <p>© 2024 Asymmetric Cryptography Demo | For Educational Use Only</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
