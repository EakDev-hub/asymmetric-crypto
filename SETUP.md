# Setup Instructions

Follow these steps to get the Asymmetric Cryptography demonstration running on your local machine.

## Prerequisites

- Node.js v18 or higher ([Download](https://nodejs.org/))
- npm (comes with Node.js)
- A modern web browser (Chrome, Firefox, Safari, or Edge)

## Installation Steps

### 1. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Start the backend server
npm run dev
```

The backend server will start on `http://localhost:3000`

You should see:
```
🔐 Asymmetric Cryptography Backend Server
Server running on: http://localhost:3000
```

### 2. Frontend Setup (in a new terminal)

```bash
# Navigate to frontend directory from project root
cd frontend

# Install dependencies
npm install

# Start the development server
npm run dev
```

The frontend will start on `http://localhost:5173` and should automatically open in your browser.

## Verification

### Test Backend

Open a new terminal and run:

```bash
curl http://localhost:3000/health
```

You should get a response like:
```json
{
  "status": "ok",
  "message": "Asymmetric Cryptography API is running",
  "timestamp": "2024-..."
}
```

### Test Frontend

1. Open `http://localhost:5173` in your browser
2. You should see the Asymmetric Cryptography Demo homepage
3. Click on "🔧 Operations" tab
4. Click "Generate New Key Pair" button
5. If keys appear, everything is working! ✅

## Quick Test of All Features

### 1. Generate Keys
- Go to Operations tab
- Click "🔑 Generate New Key Pair"
- You should see public and private keys displayed

### 2. Test Encryption/Decryption
- Type a message in the "Plain Text Message" field
- Click "🔒 Encrypt Message"
- Encrypted text should appear
- Click "🔓 Decrypt Message"
- Original message should be recovered

### 3. Test Digital Signatures
- Type a message in "Message to Sign"
- Click "✍️ Sign Message"
- Signature should appear
- Click "✅ Verify Signature"
- Should show "SIGNATURE VALID"

## Troubleshooting

### Port 3000 Already in Use

If you get an error that port 3000 is already in use:

1. Find and stop the process using port 3000:
   ```bash
   # On macOS/Linux
   lsof -ti:3000 | xargs kill -9
   
   # On Windows
   netstat -ano | findstr :3000
   taskkill /PID <PID> /F
   ```

2. Or change the port in `backend/.env`:
   ```
   PORT=3001
   ```
   And update `frontend/src/services/cryptoApi.js` accordingly.

### Port 5173 Already in Use

Change the port in `frontend/vite.config.js`:
```javascript
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5174,  // Change to different port
    open: true
  }
})
```

### Cannot Connect to Backend

1. Make sure backend is running (`npm run dev` in backend folder)
2. Check that `http://localhost:3000/health` responds
3. Verify CORS settings in `backend/src/server.js`
4. Check browser console for errors

### Module Not Found Errors

```bash
# In the directory with the error, run:
rm -rf node_modules package-lock.json
npm install
```

### Keys Not Generating

1. Check browser console for errors (F12)
2. Verify backend is running and accessible
3. Check network tab to see if request is being sent
4. Ensure no firewall is blocking localhost connections

## Development Tips

### Hot Reload

Both frontend and backend support hot reload:
- **Frontend**: Changes automatically reload in browser
- **Backend**: Using `--watch` flag, changes restart server automatically

### Viewing Logs

**Backend logs**: Check the terminal where you ran `npm run dev`

**Frontend logs**: Open browser DevTools (F12) → Console tab

### Stopping the Servers

Press `Ctrl + C` in each terminal to stop the servers.

## Next Steps

Once everything is running:

1. Read the Overview tab to understand how asymmetric cryptography works
2. Try the Operations tab to generate keys and experiment
3. Check the "How It Works" tab to see process visualizations
4. Experiment with tampering to see how security mechanisms detect changes

## Production Build (Optional)

### Backend
```bash
cd backend
npm start  # Uses node instead of --watch
```

### Frontend
```bash
cd frontend
npm run build
npm run preview
```

The production build will be in `frontend/dist/`

## Docker Setup (Optional)

If you prefer Docker, create a `docker-compose.yml` in the project root:

```yaml
version: '3.8'

services:
  backend:
    build: ./backend
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production

  frontend:
    build: ./frontend
    ports:
      - "5173:5173"
    depends_on:
      - backend
```

Then run:
```bash
docker-compose up
```

## Support

If you encounter issues:

1. Check the troubleshooting section above
2. Verify Node.js version: `node --version` (should be v18+)
3. Review browser console for frontend errors
4. Check terminal output for backend errors
5. Ensure all dependencies are installed

## Resources

- [Node.js Documentation](https://nodejs.org/docs/)
- [React Documentation](https://react.dev/)
- [Vite Documentation](https://vitejs.dev/)
- [Express.js Documentation](https://expressjs.com/)
- [Tailwind CSS Documentation](https://tailwindcss.com/)

---

Happy learning about asymmetric cryptography! 🔐
