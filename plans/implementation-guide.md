# Implementation Guide - Asymmetric Cryptography Demo

## Quick Start Commands

### Backend Setup
```bash
# Navigate to project root
cd backend

# Initialize Node.js project
npm init -y

# Install dependencies
npm install express cors body-parser dotenv

# Create directory structure
mkdir -p src/routes src/controllers src/utils

# Start development server
npm run dev
```

### Frontend Setup
```bash
# Navigate to project root
cd frontend

# Create Vite + React project
npm create vite@latest . -- --template react

# Install dependencies
npm install axios

# Install Tailwind CSS
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p

# Start development server
npm run dev
```

## Backend Implementation Details

### 1. Package.json Configuration
```json
{
  "name": "asymmetric-crypto-backend",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "start": "node src/server.js",
    "dev": "node --watch src/server.js"
  },
  "dependencies": {
    "express": "^4.18.2",
    "cors": "^2.8.5",
    "body-parser": "^1.20.2",
    "dotenv": "^16.3.1"
  }
}
```

### 2. Server Configuration (src/server.js)
Key features:
- Express app initialization
- CORS middleware for frontend communication
- JSON body parser
- Route mounting
- Error handling middleware
- Port configuration (3000)

### 3. Crypto Controller (src/controllers/cryptoController.js)
Implement these functions:

#### generateKeyPair()
- Use `crypto.generateKeyPairSync('rsa', options)`
- Options: modulusLength: 2048, publicKeyEncoding, privateKeyEncoding
- Return PEM-formatted keys

#### encryptMessage()
- Use `crypto.publicEncrypt(publicKey, buffer)`
- Padding: `crypto.constants.RSA_PKCS1_OAEP_PADDING`
- Return Base64 encoded encrypted data

#### decryptMessage()
- Use `crypto.privateDecrypt(privateKey, buffer)`
- Convert Base64 to Buffer, decrypt, return UTF-8 string

#### signMessage()
- Use `crypto.createSign('SHA256')`
- Sign with private key
- Return Base64 encoded signature

#### verifySignature()
- Use `crypto.createVerify('SHA256')`
- Verify with public key and signature
- Return boolean result

### 4. Routes Structure (src/routes/crypto.js)
```javascript
POST /api/crypto/generate-keys
POST /api/crypto/encrypt
POST /api/crypto/decrypt
POST /api/crypto/sign
POST /api/crypto/verify-signature
```

### 5. Error Handling
- Try-catch blocks in all controller functions
- Validate input parameters
- Return appropriate HTTP status codes
- Provide descriptive error messages

## Frontend Implementation Details

### 1. Tailwind Configuration (tailwind.config.js)
```javascript
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#3b82f6',
        success: '#10b981',
        error: '#ef4444',
      }
    },
  },
  plugins: [],
}
```

### 2. API Service Layer (src/services/cryptoApi.js)
Create axios instance with base URL:
- `baseURL: 'http://localhost:3000/api/crypto'`
- Export functions for each endpoint
- Handle errors with try-catch
- Return formatted responses

Functions to implement:
- `generateKeys()`
- `encryptMessage(message, publicKey)`
- `decryptMessage(encryptedData, privateKey)`
- `signMessage(message, privateKey)`
- `verifySignature(message, signature, publicKey)`

### 3. App Component Structure (src/App.jsx)

State management needed:
```javascript
const [activeTab, setActiveTab] = useState('keygen')
const [publicKey, setPublicKey] = useState('')
const [privateKey, setPrivateKey] = useState('')
const [loading, setLoading] = useState(false)
const [error, setError] = useState(null)
```

Tabs/Sections:
1. Key Generation
2. Encryption/Decryption
3. Digital Signatures

### 4. KeyPairGenerator Component

**Props**: 
- `onKeysGenerated(publicKey, privateKey)`

**State**:
- `loading`
- `generatedKeys`
- `currentStep`

**UI Elements**:
- Generate button
- Loading spinner
- Public key textarea (read-only)
- Private key textarea (read-only)
- Copy buttons for each key
- Process visualization area

**Process Steps**:
1. Click generate → Show loading
2. Call API
3. Display keys with formatting
4. Show success message
5. Enable copy functionality

### 5. EncryptDecrypt Component

**Props**:
- `publicKey`
- `privateKey`

**State**:
- `plainText`
- `encryptedText`
- `decryptedText`
- `encryptLoading`
- `decryptLoading`
- `currentStep`

**Encryption Section**:
- Textarea for plain text input
- Display public key (read-only)
- Encrypt button (disabled if no public key)
- Output showing encrypted Base64 data
- Copy button for encrypted text

**Decryption Section**:
- Textarea for encrypted text input
- Display private key (read-only)
- Decrypt button (disabled if no private key)
- Output showing decrypted plain text
- Copy button for decrypted text

**Visual Flow**:
- Show arrow animation from plain → encrypted
- Highlight active encryption/decryption step
- Display algorithm name (RSA-OAEP)

### 6. DigitalSignature Component

**Props**:
- `publicKey`
- `privateKey`

**State**:
- `messageToSign`
- `signature`
- `messageToVerify`
- `signatureToVerify`
- `verificationResult`
- `signLoading`
- `verifyLoading`

**Signing Section**:
- Textarea for message input
- Display private key (read-only)
- Sign button
- Output showing signature (Base64)
- Copy button

**Verification Section**:
- Textarea for original message
- Textarea for signature
- Display public key (read-only)
- Verify button
- Result indicator (✓ Valid / ✗ Invalid)
- Visual feedback with colors

### 7. ProcessVisualization Component

**Props**:
- `type` (keygen | encrypt | decrypt | sign | verify)
- `currentStep`

**Display Elements**:
- Step-by-step process cards
- Animated arrows between steps
- Icons for each step
- Brief descriptions

**Key Generation Steps**:
1. Generate random prime numbers
2. Calculate mathematical relationships
3. Create public key
4. Create private key
5. Export in PEM format

**Encryption Steps**:
1. Receive plain text message
2. Apply padding (OAEP)
3. Encrypt with public key
4. Encode to Base64
5. Return encrypted data

**Decryption Steps**:
1. Receive encrypted data
2. Decode from Base64
3. Decrypt with private key
4. Remove padding
5. Return plain text

**Signing Steps**:
1. Hash message with SHA-256
2. Encrypt hash with private key
3. Create digital signature
4. Encode to Base64
5. Return signature

**Verification Steps**:
1. Decode signature from Base64
2. Decrypt with public key to get hash
3. Hash original message
4. Compare both hashes
5. Return verification result

## Styling Guidelines

### Color Usage

**Primary Actions**: Blue
- Key generation button
- Active tabs
- Process step indicators

**Success States**: Green
- Successful operations
- Valid signature verification
- Completed steps

**Error States**: Red
- Failed operations
- Invalid signatures
- Error messages

**Neutral Elements**: Gray
- Disabled buttons
- Pending steps
- Background areas

### Component Styling Patterns

**Card Container**:
```javascript
className="bg-white rounded-lg shadow-md p-6 mb-6"
```

**Button Primary**:
```javascript
className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
```

**Textarea**:
```javascript
className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
```

**Success Message**:
```javascript
className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg"
```

**Error Message**:
```javascript
className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg"
```

## Key Implementation Notes

### 1. Key Format Handling
- Backend returns keys in PEM format
- Frontend displays with preserved formatting
- Use `<pre>` or monospace font for key display
- Maintain line breaks when copying

### 2. Large Data Handling
- RSA has message size limits (keySize - padding)
- For 2048-bit keys, max ~245 bytes plain text
- Show appropriate error if message too large
- Consider chunking for larger messages (optional enhancement)

### 3. Copy to Clipboard
Use modern Clipboard API:
```javascript
await navigator.clipboard.writeText(text)
```
Show temporary success message after copy

### 4. Input Validation
Frontend validation:
- Check for empty inputs
- Validate key format (starts with -----BEGIN)
- Validate Base64 format for encrypted data
- Show user-friendly error messages

Backend validation:
- Validate required fields
- Try-catch for crypto operations
- Return 400 for invalid inputs
- Return 500 for server errors

### 5. Loading States
- Disable buttons during API calls
- Show spinner or loading text
- Prevent multiple simultaneous requests
- Clear loading state on success/error

### 6. State Management
- Store keys in App.jsx state
- Pass down as props to child components
- Clear sensitive data on tab switch (optional)
- Add "Clear All" button functionality

## Testing Checklist

### Backend API Tests
- [ ] Generate keys returns valid PEM format
- [ ] Encryption with valid public key succeeds
- [ ] Decryption with valid private key succeeds
- [ ] Signing with valid private key succeeds
- [ ] Verification with valid signature succeeds
- [ ] Verification with invalid signature fails
- [ ] Error handling for invalid inputs works
- [ ] CORS allows frontend origin

### Frontend Integration Tests
- [ ] Generate keys displays both keys
- [ ] Copy buttons work correctly
- [ ] Encryption produces Base64 output
- [ ] Decryption recovers original message
- [ ] Round-trip encrypt-decrypt works
- [ ] Signature creation produces Base64
- [ ] Valid signature shows success
- [ ] Invalid signature shows failure
- [ ] All loading states display correctly
- [ ] Error messages are user-friendly
- [ ] Responsive design works on mobile
- [ ] All tabs navigate correctly

### Cross-Browser Testing
- [ ] Chrome/Edge (Chromium)
- [ ] Firefox
- [ ] Safari

## Development Tips

### 1. Start with Backend
Build and test backend endpoints with Postman/curl before frontend integration.

### 2. Component Isolation
Build each component independently and test with mock data first.

### 3. Progressive Enhancement
Start with basic functionality, then add visualizations and animations.

### 4. Console Logging
Add strategic console.logs during development to track data flow.

### 5. Error Boundaries
Add React error boundaries to catch rendering errors gracefully.

### 6. Code Organization
Keep components focused and single-purpose. Extract repeated logic into utils.

### 7. Git Workflow
Commit after each major feature completion:
- Backend server setup
- Each endpoint implementation
- Frontend setup
- Each component
- Styling
- Final integration

## Performance Considerations

### Backend
- Crypto operations are CPU-intensive
- Consider adding rate limiting for production
- Key generation is relatively slow (expected)

### Frontend
- Keys and encrypted data can be large strings
- Use textarea with scrolling for long content
- Debounce input if adding real-time features
- Lazy load visualization components if heavy

## Security Reminders

**Important Disclaimers to Display**:
1. "This is an educational demonstration"
2. "Do not use for real sensitive data"
3. "Keys are not stored persistently"
4. "Use HTTPS in production environments"
5. "Implement proper key management for real applications"

Add these warnings in the UI footer or help section.

---

This implementation guide provides all the necessary details to build the asymmetric cryptography demonstration application. Follow the checklist in the main todo list to track progress through each implementation phase.
