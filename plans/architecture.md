# Asymmetric Cryptography Demonstration - Architecture Plan

## System Overview

This application demonstrates Asymmetric Cryptography concepts with a modern React frontend and Node.js backend. Users can:
- Generate RSA key pairs
- Encrypt and decrypt messages
- Create and verify digital signatures
- Visualize each cryptographic step in real-time

## Technology Stack

### Frontend
- **React 18** with Vite for fast development
- **Tailwind CSS** for responsive, modern styling
- **Axios** for API communication
- **React State** for local state management
- **Framer Motion** (optional) for smooth animations

### Backend
- **Node.js** with Express.js framework
- **crypto** module for cryptographic operations
- **cors** for cross-origin requests
- **body-parser** for JSON parsing

## System Architecture

```mermaid
graph TB
    User[User Interface] --> Frontend[React Frontend - Vite]
    Frontend --> API[Express.js Backend API]
    API --> Crypto[Node Crypto Module]
    
    Frontend --> KeyGen[Key Pair Generator Component]
    Frontend --> EncDec[Encrypt/Decrypt Component]
    Frontend --> DigSig[Digital Signature Component]
    Frontend --> Visual[Process Visualization Component]
    
    API --> GenKeys[/generate-keys endpoint]
    API --> Encrypt[/encrypt endpoint]
    API --> Decrypt[/decrypt endpoint]
    API --> Sign[/sign endpoint]
    API --> Verify[/verify-signature endpoint]
    
    Crypto --> GenKeys
    Crypto --> Encrypt
    Crypto --> Decrypt
    Crypto --> Sign
    Crypto --> Verify
```

## Project Structure

```
asymmetric-cryptography/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── KeyPairGenerator.jsx
│   │   │   ├── EncryptDecrypt.jsx
│   │   │   ├── DigitalSignature.jsx
│   │   │   ├── ProcessVisualization.jsx
│   │   │   ├── Header.jsx
│   │   │   └── Footer.jsx
│   │   ├── services/
│   │   │   └── cryptoApi.js
│   │   ├── utils/
│   │   │   └── helpers.js
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── public/
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── postcss.config.js
├── backend/
│   ├── src/
│   │   ├── routes/
│   │   │   └── crypto.js
│   │   ├── controllers/
│   │   │   └── cryptoController.js
│   │   ├── utils/
│   │   │   └── cryptoHelpers.js
│   │   └── server.js
│   ├── package.json
│   └── .env
├── plans/
│   └── architecture.md
└── README.md
```

## Component Breakdown

### Frontend Components

#### 1. App.jsx
Main application container with tab/section navigation between different cryptographic operations.

#### 2. KeyPairGenerator.jsx
- Displays button to generate RSA key pair
- Shows generated public and private keys in formatted text areas
- Provides copy-to-clipboard functionality
- Visualizes key generation process with loading animation

#### 3. EncryptDecrypt.jsx
- **Encryption Section:**
  - Input field for plain text message
  - Display area for public key
  - Button to encrypt message
  - Output area showing encrypted data (Base64)
  
- **Decryption Section:**
  - Input field for encrypted text
  - Display area for private key
  - Button to decrypt message
  - Output area showing decrypted plain text

- **Process Visualization:**
  - Shows step-by-step encryption flow
  - Displays decryption flow with visual feedback

#### 4. DigitalSignature.jsx
- **Signing Section:**
  - Input for message to sign
  - Private key display
  - Generate signature button
  - Signature output in Base64

- **Verification Section:**
  - Input for original message
  - Input for signature
  - Public key display
  - Verify button with success/failure indicator

#### 5. ProcessVisualization.jsx
Reusable component that shows animated flow diagrams for:
- Key generation process
- Encryption flow
- Decryption flow
- Signature creation
- Signature verification

#### 6. Header.jsx
Application title, navigation, and brief description of asymmetric cryptography.

#### 7. Footer.jsx
Additional resources and educational links.

### Backend API Design

#### Base URL
`http://localhost:3000/api/crypto`

#### Endpoints

##### 1. Generate Key Pair
```
POST /generate-keys
Response:
{
  "publicKey": "-----BEGIN PUBLIC KEY-----...",
  "privateKey": "-----BEGIN PRIVATE KEY-----...",
  "keySize": 2048
}
```

##### 2. Encrypt Message
```
POST /encrypt
Request:
{
  "message": "Hello, World!",
  "publicKey": "-----BEGIN PUBLIC KEY-----..."
}
Response:
{
  "encrypted": "base64_encoded_encrypted_data",
  "algorithm": "RSA-OAEP"
}
```

##### 3. Decrypt Message
```
POST /decrypt
Request:
{
  "encryptedData": "base64_encoded_encrypted_data",
  "privateKey": "-----BEGIN PRIVATE KEY-----..."
}
Response:
{
  "decrypted": "Hello, World!"
}
```

##### 4. Create Signature
```
POST /sign
Request:
{
  "message": "Message to sign",
  "privateKey": "-----BEGIN PRIVATE KEY-----..."
}
Response:
{
  "signature": "base64_encoded_signature",
  "algorithm": "SHA256"
}
```

##### 5. Verify Signature
```
POST /verify-signature
Request:
{
  "message": "Message to sign",
  "signature": "base64_encoded_signature",
  "publicKey": "-----BEGIN PUBLIC KEY-----..."
}
Response:
{
  "verified": true,
  "algorithm": "SHA256"
}
```

## Data Flow Diagrams

### Key Generation Flow
```mermaid
sequenceDiagram
    participant User
    participant Frontend
    participant Backend
    participant Crypto
    
    User->>Frontend: Click Generate Keys
    Frontend->>Frontend: Show loading state
    Frontend->>Backend: POST /generate-keys
    Backend->>Crypto: generateKeyPairSync()
    Crypto-->>Backend: {publicKey, privateKey}
    Backend-->>Frontend: Return key pair
    Frontend->>Frontend: Store keys in state
    Frontend->>User: Display keys with copy buttons
```

### Encryption/Decryption Flow
```mermaid
sequenceDiagram
    participant User
    participant Frontend
    participant Backend
    participant Crypto
    
    User->>Frontend: Enter message + Public Key
    User->>Frontend: Click Encrypt
    Frontend->>Backend: POST /encrypt
    Backend->>Crypto: publicEncrypt()
    Crypto-->>Backend: Encrypted data
    Backend-->>Frontend: Base64 encrypted data
    Frontend->>User: Display encrypted message
    
    User->>Frontend: Enter encrypted data + Private Key
    User->>Frontend: Click Decrypt
    Frontend->>Backend: POST /decrypt
    Backend->>Crypto: privateDecrypt()
    Crypto-->>Backend: Decrypted message
    Backend-->>Frontend: Plain text
    Frontend->>User: Display decrypted message
```

### Digital Signature Flow
```mermaid
sequenceDiagram
    participant User
    participant Frontend
    participant Backend
    participant Crypto
    
    User->>Frontend: Enter message + Private Key
    User->>Frontend: Click Sign
    Frontend->>Backend: POST /sign
    Backend->>Crypto: createSign() + sign()
    Crypto-->>Backend: Signature
    Backend-->>Frontend: Base64 signature
    Frontend->>User: Display signature
    
    User->>Frontend: Enter message + Signature + Public Key
    User->>Frontend: Click Verify
    Frontend->>Backend: POST /verify-signature
    Backend->>Crypto: createVerify() + verify()
    Crypto-->>Backend: Verification result
    Backend-->>Frontend: true/false
    Frontend->>User: Show verification status
```

## Cryptographic Operations Explained

### RSA Key Pair Generation
- Uses 2048-bit RSA algorithm
- Generates mathematically linked public and private keys
- Public key: Used for encryption and signature verification
- Private key: Used for decryption and signature creation

### Encryption Process
1. User inputs plain text message
2. Message is encrypted using RSA-OAEP with public key
3. Encrypted data is encoded to Base64 for display
4. Only the corresponding private key can decrypt this data

### Decryption Process
1. User inputs encrypted message (Base64)
2. Data is decoded from Base64
3. Decrypted using RSA-OAEP with private key
4. Original plain text is recovered

### Digital Signature Creation
1. Message is hashed using SHA-256
2. Hash is encrypted with private key to create signature
3. Signature proves message authenticity and non-repudiation

### Signature Verification
1. Signature is decrypted with public key to get hash
2. Message is independently hashed
3. Both hashes are compared
4. Match confirms message integrity and authenticity

## UI/UX Design Principles

### Color Scheme
- **Primary**: Blue tones for trust and security
- **Success**: Green for verified/successful operations
- **Error**: Red for failed operations
- **Neutral**: Gray for text and backgrounds

### Layout
- Single page application with tabbed interface
- Each cryptographic operation in its own section
- Clear visual separation between input and output areas
- Responsive design for mobile and desktop

### Visual Feedback
- Loading spinners during API calls
- Success/error messages with icons
- Smooth transitions between states
- Animated process flows showing data transformation

### Educational Elements
- Tooltips explaining cryptographic terms
- Step-by-step process visualization
- Code snippets showing how operations work
- Links to additional learning resources

## Security Considerations

### Important Notes
1. **Educational Purpose**: This is a demonstration tool, not for production use
2. **Key Storage**: Keys are stored in browser state (not persistent)
3. **HTTPS**: In production, all communications should use HTTPS
4. **Key Management**: Real applications need secure key storage solutions
5. **Backend Security**: Add rate limiting and input validation

### Best Practices Demonstrated
- Proper key size (2048-bit minimum)
- Modern padding schemes (OAEP for encryption)
- Strong hash functions (SHA-256 for signatures)
- Clear separation of public/private key usage

## Development Workflow

### Setup Phase
1. Initialize project structure
2. Set up frontend with Vite + React + Tailwind
3. Set up backend with Express.js
4. Install dependencies

### Backend Development
1. Create server structure
2. Implement crypto controller with all operations
3. Set up API routes
4. Add error handling and validation
5. Test endpoints with Postman/curl

### Frontend Development
1. Set up component structure
2. Create API service layer
3. Build individual components
4. Implement state management
5. Add styling with Tailwind CSS
6. Create animations and visualizations

### Integration & Testing
1. Connect frontend to backend
2. Test all cryptographic operations
3. Verify error handling
4. Check responsive design
5. Cross-browser testing

## Success Criteria

- [ ] Users can generate RSA key pairs
- [ ] Users can encrypt messages with public key
- [ ] Users can decrypt messages with private key
- [ ] Users can create digital signatures
- [ ] Users can verify signatures
- [ ] All operations show visual feedback
- [ ] Process visualizations are clear and educational
- [ ] UI is responsive and intuitive
- [ ] Error handling is robust
- [ ] Documentation is complete

## Future Enhancements

1. **Additional Algorithms**: Add ECC, DSA options
2. **Key Export/Import**: Allow saving/loading keys
3. **File Encryption**: Support encrypting files
4. **Multiple Key Pairs**: Manage multiple identities
5. **Message Exchange**: Simulate secure communication between users
6. **Performance Metrics**: Show encryption/decryption speed
7. **Educational Mode**: Interactive tutorials
8. **Dark Mode**: Theme toggle option

---

This architecture provides a solid foundation for building an educational, interactive demonstration of asymmetric cryptography using modern web technologies.
