# Asymmetric Cryptography Demonstration

An interactive web application that demonstrates asymmetric (public-key) cryptography concepts using React, Node.js, and RSA encryption.

## 🎯 Features

- **RSA Key Pair Generation**: Generate 2048-bit public and private key pairs
- **Message Encryption/Decryption**: Encrypt messages with public key, decrypt with private key
- **Digital Signatures**: Create and verify digital signatures
- **Visual Process Flow**: Step-by-step visualization of cryptographic operations
- **Educational Interface**: Learn how asymmetric cryptography works interactively
- **Modern UI**: Built with React, Vite, and Tailwind CSS

## 🏗️ Architecture

### Frontend
- **React 18** with Vite for fast development
- **Tailwind CSS** for modern, responsive styling
- **Axios** for API communication
- Component-based architecture

### Backend
- **Node.js** with Express.js
- **Native Crypto Module** for RSA operations
- RESTful API design
- CORS-enabled for frontend communication

## 📋 Prerequisites

- **Node.js** (v18 or higher recommended)
- **npm** (comes with Node.js)
- Modern web browser (Chrome, Firefox, Safari, Edge)

## 🚀 Quick Start

### 1. Clone or Download the Project

```bash
cd "Asymmetric Cryptography"
```

### 2. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Initialize Node.js project
npm init -y

# Install dependencies
npm install express cors body-parser dotenv

# Create directory structure
mkdir -p src/routes src/controllers src/utils

# Start the server (after implementation)
npm run dev
```

The backend server will start on `http://localhost:3000`

### 3. Frontend Setup

```bash
# Navigate to frontend directory (from project root)
cd frontend

# Create Vite + React project
npm create vite@latest . -- --template react

# Install dependencies
npm install
npm install axios

# Install and configure Tailwind CSS
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p

# Start the development server (after implementation)
npm run dev
```

The frontend will start on `http://localhost:5173`

## 📁 Project Structure

```
asymmetric-cryptography/
├── frontend/                  # React frontend application
│   ├── src/
│   │   ├── components/       # React components
│   │   │   ├── KeyPairGenerator.jsx
│   │   │   ├── EncryptDecrypt.jsx
│   │   │   ├── DigitalSignature.jsx
│   │   │   ├── ProcessVisualization.jsx
│   │   │   ├── Header.jsx
│   │   │   └── Footer.jsx
│   │   ├── services/         # API communication
│   │   │   └── cryptoApi.js
│   │   ├── utils/            # Helper functions
│   │   │   └── helpers.js
│   │   ├── App.jsx           # Main app component
│   │   ├── main.jsx          # Entry point
│   │   └── index.css         # Global styles
│   ├── package.json
│   ├── vite.config.js
│   └── tailwind.config.js
│
├── backend/                   # Node.js backend API
│   ├── src/
│   │   ├── routes/           # API routes
│   │   │   └── crypto.js
│   │   ├── controllers/      # Business logic
│   │   │   └── cryptoController.js
│   │   ├── utils/            # Helper functions
│   │   │   └── cryptoHelpers.js
│   │   └── server.js         # Express server
│   ├── package.json
│   └── .env
│
├── plans/                     # Architecture & implementation docs
│   ├── architecture.md
│   └── implementation-guide.md
│
└── README.md                  # This file
```

## 🔧 API Endpoints

Base URL: `http://localhost:3000/api/crypto`

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/generate-keys` | POST | Generate RSA key pair |
| `/encrypt` | POST | Encrypt message with public key |
| `/decrypt` | POST | Decrypt message with private key |
| `/sign` | POST | Create digital signature |
| `/verify-signature` | POST | Verify digital signature |

### Example API Usage

**Generate Keys:**
```bash
curl -X POST http://localhost:3000/api/crypto/generate-keys
```

**Encrypt Message:**
```bash
curl -X POST http://localhost:3000/api/crypto/encrypt \
  -H "Content-Type: application/json" \
  -d '{"message": "Hello World", "publicKey": "-----BEGIN PUBLIC KEY-----..."}'
```

## 🎓 How It Works

### RSA Asymmetric Cryptography

This application demonstrates the RSA algorithm, which uses two mathematically linked keys:

1. **Public Key**: Can be shared with anyone
   - Used to encrypt messages
   - Used to verify signatures

2. **Private Key**: Must be kept secret
   - Used to decrypt messages
   - Used to create signatures

### Key Operations

#### 1. Key Generation
- Generates a 2048-bit RSA key pair
- Public and private keys are mathematically related
- Only the private key can decrypt what the public key encrypts

#### 2. Encryption/Decryption
- **Encryption**: Message + Public Key → Encrypted Data
- **Decryption**: Encrypted Data + Private Key → Original Message
- Uses RSA-OAEP padding for security

#### 3. Digital Signatures
- **Signing**: Message + Private Key → Signature
- **Verification**: Message + Signature + Public Key → Valid/Invalid
- Proves message authenticity and integrity
- Uses SHA-256 hashing

## 💡 Use Cases

### Encryption/Decryption
Bob wants to send Alice a secret message:
1. Alice generates a key pair and shares her public key
2. Bob encrypts his message with Alice's public key
3. Only Alice can decrypt it with her private key

### Digital Signatures
Alice wants to prove she wrote a message:
1. Alice signs the message with her private key
2. Anyone can verify it's from Alice using her public key
3. The signature proves Alice wrote it and it hasn't been tampered with

## 🎨 User Interface

### Tabs/Sections

**1. Key Generation**
- Generate new RSA key pair
- View and copy public/private keys
- Visual feedback during generation

**2. Encryption/Decryption**
- Encrypt messages with public key
- Decrypt messages with private key
- See the transformation process

**3. Digital Signatures**
- Sign messages with private key
- Verify signatures with public key
- Visual validation feedback

## 🔒 Security Notes

⚠️ **Important Disclaimers:**

- This is an **educational demonstration** tool
- **Do NOT use for real sensitive data**
- Keys are stored in browser memory only (not persistent)
- For production use:
  - Implement HTTPS
  - Use secure key storage (HSM, key vaults)
  - Add rate limiting and authentication
  - Follow security best practices

## 🛠️ Development

### Adding New Features

1. Backend: Add endpoint in [`src/routes/crypto.js`](backend/src/routes/crypto.js)
2. Backend: Implement logic in [`src/controllers/cryptoController.js`](backend/src/controllers/cryptoController.js)
3. Frontend: Add API call in [`src/services/cryptoApi.js`](frontend/src/services/cryptoApi.js)
4. Frontend: Create/update component in [`src/components/`](frontend/src/components/)

### Running Tests

```bash
# Backend (after adding tests)
cd backend
npm test

# Frontend (after adding tests)
cd frontend
npm test
```

## 📚 Learning Resources

- [RSA Algorithm Explained](https://en.wikipedia.org/wiki/RSA_(cryptosystem))
- [Public-Key Cryptography](https://en.wikipedia.org/wiki/Public-key_cryptography)
- [Digital Signatures](https://en.wikipedia.org/wiki/Digital_signature)
- [Node.js Crypto Documentation](https://nodejs.org/api/crypto.html)

## 🐛 Troubleshooting

### Backend won't start
- Ensure port 3000 is not in use
- Check Node.js version (v18+)
- Verify all dependencies are installed

### Frontend won't connect to backend
- Ensure backend is running on port 3000
- Check CORS configuration
- Verify API base URL in [`cryptoApi.js`](frontend/src/services/cryptoApi.js)

### Encryption fails
- Ensure message isn't too long (max ~245 bytes for 2048-bit key)
- Verify public key format is correct (PEM format)
- Check for network errors in browser console

### Decryption fails
- Ensure using the matching private key
- Verify encrypted data is in Base64 format
- Check that data wasn't corrupted during copy/paste

## 🤝 Contributing

This is an educational project. Feel free to:
- Add new cryptographic algorithms (ECC, DSA)
- Improve UI/UX
- Add more visualizations
- Enhance documentation
- Add unit tests

## 📄 License

This project is open source and available for educational purposes.

## 👨‍💻 Tech Stack

- **Frontend**: React 18, Vite, Tailwind CSS, Axios
- **Backend**: Node.js, Express.js, Native Crypto Module
- **Cryptography**: RSA-2048, SHA-256, OAEP Padding

## 🎯 Next Steps

1. Review the detailed plans in the [`plans/`](plans/) directory
2. Follow the implementation guide to build the application
3. Test all features thoroughly
4. Customize the UI to your preferences
5. Deploy (optional) for demonstration purposes

---

**Educational Purpose Only** - This application demonstrates cryptographic concepts and should not be used for protecting real sensitive data without proper security measures.
