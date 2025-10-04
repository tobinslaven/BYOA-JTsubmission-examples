# 🚀 Deployment Guide - Backend Proxy Setup

## Overview
We've created a secure backend that keeps your OpenAI API key safe. The frontend now calls your backend instead of OpenAI directly.

## 📁 What's Been Created

```
backend/
├── package.json          # Backend dependencies
├── server.js            # Express server with OpenAI integration
├── env.example          # Environment variables template
├── .gitignore           # Ignores .env and node_modules
└── README.md            # Backend documentation

src/services/api.ts      # Updated to call backend instead of OpenAI
env.local.example        # Frontend environment template
```

## 🎯 Deployment Steps

### Step 1: Deploy Backend (Choose One)

#### Option A: Railway (Recommended - Free)
1. Go to [railway.app](https://railway.app)
2. Sign up with GitHub
3. Click "New Project" → "Deploy from GitHub repo"
4. Select your `BYOA-JTsubmission-examples` repository
5. **Important**: Set root directory to `backend`
6. Add environment variables:
   - `OPENAI_API_KEY`: Your OpenAI API key
   - `FRONTEND_URL`: `https://tobinslaven.github.io`
7. Deploy!

#### Option B: Heroku
```bash
cd backend
heroku create your-app-name
heroku config:set OPENAI_API_KEY=your_key_here
heroku config:set FRONTEND_URL=https://tobinslaven.github.io
git subtree push --prefix backend heroku main
```

#### Option C: Vercel
1. Go to [vercel.com](https://vercel.com)
2. Import GitHub repository
3. Set root directory to `backend`
4. Add environment variables in dashboard
5. Deploy!

### Step 2: Update Frontend Configuration

Once your backend is deployed, update the frontend:

1. **For GitHub Pages deployment**:
   - Add environment variable in your build process:
   ```bash
   REACT_APP_BACKEND_URL=https://your-backend-domain.com
   ```

2. **Update GitHub Pages**:
   - The frontend will automatically use the new backend
   - No API key needed in the frontend anymore!

### Step 3: Test the Complete System

1. **Test backend directly**:
   ```bash
   curl -X POST https://your-backend-domain.com/api/generate-examples \
     -H "Content-Type: application/json" \
     -d '{"studio":"ES","promptText":"Test prompt"}'
   ```

2. **Test frontend**: Visit your GitHub Pages URL and submit a challenge

## 🔒 Security Benefits

- ✅ **API key never exposed** to browsers
- ✅ **Full control** over usage and billing
- ✅ **Rate limiting** can be added easily
- ✅ **Monitoring** and logging capabilities
- ✅ **Follows OpenAI best practices**

## 🛠️ Local Development

```bash
# Terminal 1: Start backend
cd backend
npm install
npm run dev

# Terminal 2: Start frontend
npm start
```

## 📊 Expected Flow

```
User submits challenge
    ↓
Frontend calls your backend
    ↓
Backend calls OpenAI with secure API key
    ↓
Backend returns results to frontend
    ↓
User sees examples (or mock data if API fails)
```

## 🚨 Troubleshooting

### Backend not responding
- Check deployment logs
- Verify environment variables
- Test backend URL directly

### Frontend shows "Backend unavailable"
- Check CORS settings
- Verify backend URL in frontend
- Check network requests in browser dev tools

### Still seeing mock data
- Check backend logs for OpenAI API errors
- Verify API key is correct
- Check OpenAI account credits

## 🎉 Success Indicators

- ✅ Backend health check returns 200 OK
- ✅ Frontend successfully calls backend
- ✅ Real AI-generated examples appear
- ✅ No API key visible in browser source code
- ✅ Alert shows "Demo Mode" only when backend is down

Your app is now properly secured and follows industry best practices! 🚀
