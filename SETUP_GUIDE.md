# TrackNext - Complete Setup & Deployment Guide

## 🚀 Quick Start (Express Backend - Recommended)

### Prerequisites
- **Node.js v18+** (you have v24.18.0 ✓)
- **npm v8+** (you have v11.16.0 ✓)
- **MongoDB Atlas Account** (free tier available)

### Step 1: Install Dependencies
```bash
cd d:\tracknext
npm install
```

### Step 2: Configure MongoDB
In PowerShell, run:
```powershell
cd d:\tracknext
.\setup-mongodb.ps1
```

This will:
- Prompt for your MongoDB Atlas URI (input is hidden)
- Test the connection
- Save credentials to `.env` (Git-ignored)

**Don't have MongoDB Atlas?**
1. Create free account: https://www.mongodb.com/cloud/atlas
2. Create a cluster (free tier)
3. Create a database user
4. Get your connection string: `mongodb+srv://username:password@cluster.mongodb.net/tracknext?retryWrites=true&w=majority`

### Step 3: Start the Server
```bash
npm start
```

Expected output:
```
listening on http://localhost:3000
MongoDB connected!
```

### Step 4: Open in Browser
Navigate to: **http://localhost:3000**

---

## 📁 Project Structure

```
tracknext/
├── index.html              # Frontend HTML
├── style.css              # Styling
├── script.js              # Frontend JavaScript
├── server.js              # Express backend (PORT 3000)
├── main.py                # FastAPI backend (PORT 8001)
├── setup-mongodb.ps1      # MongoDB setup script
├── package.json           # Node dependencies
├── requirements.txt       # Python dependencies
├── .env                   # Environment variables (Git-ignored)
├── .env.example          # Environment template
├── assets/               # Images & static files
└── node_modules/        # Installed packages
```

---

## 🔧 Advanced Setup

### Option A: Express Backend Only (Recommended)
```bash
npm install
npm start
# Open http://localhost:3000
```

### Option B: Both Express + FastAPI
**Terminal 1 - Express:**
```bash
npm install
npm start
# Runs on http://localhost:3000
```

**Terminal 2 - FastAPI (requires Python 3.8+):**
```bash
pip install -r requirements.txt
python -m uvicorn main:app --host 0.0.0.0 --port 8001
# Runs on http://localhost:8001
```

### Option C: Static Server (No Backend)
```bash
python -m http.server 8000
# Open http://localhost:8000
# Uses demo data (no MongoDB needed)
```

---

## 📊 API Endpoints

### Health Check
- **Express:** `GET http://localhost:3000/api/health`
- **FastAPI:** `GET http://localhost:8001/api/health`

Response:
```json
{
  "status": "healthy",
  "database": "mongodb",
  "version": "1.0.0"
}
```

### Get Opportunities
- **Express:** `GET http://localhost:3000/api/opportunities`
- **FastAPI:** `GET http://localhost:8001/api/opportunities`

Response:
```json
{
  "opportunities": [
    {
      "id": 1,
      "title": "Frontend Developer Internship",
      "category": "Internship",
      "date": "2026-10-10",
      ...
    }
  ],
  "count": 15
}
```

---

## 🗄️ MongoDB Setup Details

### Create a Cluster
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a new project
3. Create a new cluster (free tier recommended)
4. Wait for cluster to deploy (~3 minutes)

### Create Database User
1. Go to Database Access
2. Click "Add New Database User"
3. Choose "Password" authentication
4. Create strong username & password
5. Set permissions to "Read and write to all databases"

### Network Access
1. Go to Network Access
2. Click "Add IP Address"
3. Add your IP or **0.0.0.0/0** (dev only, not production!)

### Get Connection String
1. Go to Cluster overview
2. Click "Connect"
3. Choose "Drivers" (Node.js)
4. Copy connection string
5. Format: `mongodb+srv://username:password@cluster.mongodb.net/tracknext?retryWrites=true&w=majority`

### Test Connection
Run PowerShell script:
```powershell
.\setup-mongodb.ps1
```

---

## ✅ Verification Checklist

- [ ] `npm install` completed without errors
- [ ] `.env` file has valid `MONGODB_URI`
- [ ] Server starts with `npm start`
- [ ] Browser opens http://localhost:3000
- [ ] Opportunities load
- [ ] Search functionality works
- [ ] Save opportunities feature works
- [ ] Modal opens when clicking opportunities
- [ ] Mobile menu works (on smaller screens)

---

## 🐛 Troubleshooting

### "Cannot find module 'mongodb'"
```bash
npm install
npm start
```

### "MongoDB connection failed"
- Check `.env` file has valid URI
- Verify IP is allowed in Atlas Network Access
- Check username/password are correct
- Ensure database user exists

### Port 3000 already in use
```bash
# Find process on port 3000
netstat -ano | findstr :3000

# Kill process (replace PID with actual number)
taskkill /PID [PID] /F

# Or use different port
$env:PORT=3001; npm start
```

### CORS errors
- Express server handles CORS automatically
- Check browser console for detailed error

### Opportunities not loading
- Check `/api/health` responds
- Check network tab in browser DevTools
- Verify MongoDB is connected

---

## 🚢 Deployment

### Deploy Frontend Only (Static Site)
- **Netlify:** Drag & drop `index.html`, `style.css`, `script.js`, `assets/`
- **Vercel:** Same as Netlify
- **GitHub Pages:** Push files to `gh-pages` branch

### Deploy Full Stack (Backend + Frontend)
- **Render:** Use Node.js template, connect GitHub repo
- **Railway:** Deploy with `Procfile` or Railway dashboard
- **Heroku:** (deprecated free tier) Deploy with `Procfile`

### Environment Variables for Production
Set on hosting platform:
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/tracknext
MONGODB_DB_NAME=tracknext
NODE_ENV=production
```

---

## 📱 Features Included

✓ Responsive design (desktop, tablet, mobile)
✓ Search & filter opportunities
✓ Save favorites (localStorage)
✓ Opportunity detail modals
✓ Mobile navigation
✓ MongoDB backend integration
✓ Automatic demo data fallback
✓ Health check endpoints
✓ Production-ready error handling

---

## 📞 Support

For issues:
1. Check troubleshooting section above
2. Review browser console (F12)
3. Check server logs (terminal output)
4. Verify `.env` configuration
5. Test MongoDB connection: `.\setup-mongodb.ps1`

---

## 📄 License

MIT - See LICENSE file for details

