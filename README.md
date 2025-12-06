# ParentLink

A simple, senior-friendly file sharing app that lets your mom view files you share via Google Drive.

## How It Works

1. **You** upload files to a specific Google Drive folder (no app needed on your end)
2. **Mom** opens the app, signs in, and sees all shared files in a clean, simple interface
3. New files show up as a big notification badge
4. She can tap to view photos, videos, documents, and more

## Features

- 🔔 **New File Badge** - Shows count of unseen files
- 📱 **Senior-Friendly UI** - Extra large buttons, simple navigation
- 📁 **All File Types** - Photos, videos, audio, documents, PDFs
- ☁️ **Google Drive Backend** - No separate database needed
- 🔐 **Google Sign-In** - Secure access via Google account

## Setup

### 1. Google Cloud Console Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project (or select existing)
3. Enable the **Google Drive API**:
   - Go to "APIs & Services" > "Library"
   - Search for "Google Drive API"
   - Click "Enable"

4. Create OAuth credentials:
   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "OAuth client ID"
   - Choose "Web application"
   - Add authorized JavaScript origins:
     - `http://localhost:5173` (for development)
     - Your production URL (when deployed)
   - Copy the **Client ID**

5. Configure OAuth consent screen:
   - Go to "OAuth consent screen"
   - Add your mom's email as a test user (if app is in testing mode)

### 2. Google Drive Folder Setup

1. Create a folder in your Google Drive for sharing files
2. Right-click the folder > "Share"
3. Add your mom's Google account with "Viewer" access
4. Copy the **Folder ID** from the URL:
   ```
   https://drive.google.com/drive/folders/THIS_IS_THE_FOLDER_ID
   ```

### 3. App Configuration

1. Copy `.env.local` and fill in:
   ```
   VITE_GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
   VITE_DRIVE_FOLDER_ID=your-folder-id
   ```

### 4. Run Locally

```bash
npm install
npm run dev
```

Open http://localhost:5173

### 5. Deploy

For deployment (Vercel, Netlify, etc.):
1. Set the environment variables in your hosting platform
2. Add your production URL to the OAuth authorized origins in Google Cloud Console

## Usage

### For You (Sharing Files)
Just drop files into the Google Drive folder - that's it! Mom will see them in the app.

### For Mom (Viewing Files)
1. Open the app
2. Sign in with Google (one time)
3. If there are new files, tap the big notification button
4. Browse all files anytime with "View All Files"

## File Structure

```
parentlink/
├── App.tsx              # Main app component
├── types.ts             # TypeScript types
├── services/
│   ├── googleAuthService.ts   # Google OAuth handling
│   └── googleDriveService.ts  # Drive API + seen tracking
├── views/
│   ├── Login.tsx        # Sign-in screen
│   ├── Home.tsx         # Main menu with new file badge
│   ├── NewFiles.tsx     # List of unseen files
│   ├── AllFiles.tsx     # Browse all files
│   ├── FileViewer.tsx   # View individual file
│   └── Upload.tsx       # Optional: let mom share back
└── components/
    └── BigButton.tsx    # Large accessible button
```

## Customization

- Change colors in Tailwind classes (currently warm amber/orange theme)
- Modify button sizes in `BigButton.tsx`
- Adjust file type icons in `types.ts` `getFileCategory()`

---

Made with ❤️ for family
