# JT Submission Backend API

This is the backend server for the JT Submission Examples app. It securely handles OpenAI API calls and serves the frontend.

## 🏗️ Architecture

```
Frontend (GitHub Pages) → Backend (Railway/Heroku) → OpenAI API
```

## 🚀 Quick Start

### 1. Install Dependencies
```bash
cd backend
npm install
```

### 2. Configure Environment
```bash
# Copy the example environment file
cp env.example .env

# Edit .env and add your OpenAI API key
OPENAI_API_KEY=your_openai_api_key_here
PORT=3001
NODE_ENV=production
FRONTEND_URL=https://tobinslaven.github.io
```

### 3. Run Locally
```bash
npm run dev
```

The server will start on `http://localhost:3001`

## 🌐 Deployment Options

### Option A: Railway (Recommended)
1. Go to [railway.app](https://railway.app)
2. Connect your GitHub account
3. Create a new project from your repository
4. Select the `backend` folder
5. Add environment variables in Railway dashboard:
   - `OPENAI_API_KEY`: Your OpenAI API key
   - `FRONTEND_URL`: `https://tobinslaven.github.io`
6. Deploy!

### Option B: Heroku
1. Install Heroku CLI
2. Create a new app: `heroku create your-app-name`
3. Set environment variables:
   ```bash
   heroku config:set OPENAI_API_KEY=your_key_here
   heroku config:set FRONTEND_URL=https://tobinslaven.github.io
   ```
4. Deploy: `git push heroku main`

### Option C: Vercel
1. Go to [vercel.com](https://vercel.com)
2. Import your GitHub repository
3. Set root directory to `backend`
4. Add environment variables in Vercel dashboard
5. Deploy!

## 📡 API Endpoints

### Health Check
```
GET /health
```

### Generate Examples
```
POST /api/generate-examples
Content-Type: application/json

{
  "studio": "ES" | "MS" | "LP",
  "promptText": "Your project directions here"
}
```

Response:
```json
{
  "worldClass": {
    "text": "Generated world-class example...",
    "criteriaCovered": ["criteria1", "criteria2"]
  },
  "notApproved": {
    "text": "Generated not-approved example...",
    "criteriaMissing": ["missing1", "missing2"]
  },
  "criteriaAll": ["all", "criteria", "list"],
  "isMockData": false
}
```

## 🔒 Security Features

- ✅ API key stored securely on server (never exposed to browser)
- ✅ CORS configured for your GitHub Pages domain
- ✅ Input validation and sanitization
- ✅ Error handling with fallback to mock data
- ✅ Rate limiting ready (can be added)

## 🛠️ Development

```bash
# Install dependencies
npm install

# Run in development mode with auto-reload
npm run dev

# Run in production mode
npm start
```

## 📝 Environment Variables

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `OPENAI_API_KEY` | Your OpenAI API key | Yes | - |
| `PORT` | Server port | No | 3001 |
| `NODE_ENV` | Environment | No | development |
| `FRONTEND_URL` | Frontend URL for CORS | Yes | http://localhost:3000 |

## 🚨 Troubleshooting

### Backend not responding
- Check if the server is running on the correct port
- Verify environment variables are set correctly
- Check server logs for errors

### CORS errors
- Ensure `FRONTEND_URL` is set to your GitHub Pages URL
- Check that the frontend is calling the correct backend URL

### OpenAI API errors
- Verify your API key is valid and has credits
- Check OpenAI service status
- Review server logs for specific error messages
