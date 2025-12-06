import React, { useState, useEffect, useCallback } from 'react';
import { ViewState, DriveFile } from './types';
import { isSignedIn, signOut } from './services/googleAuthService';
import { fetchFilesFromFolder, getNewFiles } from './services/googleDriveService';
import Login from './views/Login';
import Home from './views/Home';
import NewFiles from './views/NewFiles';
import AllFiles from './views/AllFiles';
import FileViewer from './views/FileViewer';
import Upload from './views/Upload';
import { Loader2 } from 'lucide-react';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewState>(ViewState.LOGIN);
  const [allFiles, setAllFiles] = useState<DriveFile[]>([]);
  const [newFiles, setNewFiles] = useState<DriveFile[]>([]);
  const [selectedFile, setSelectedFile] = useState<DriveFile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load files from Drive
  const loadFiles = useCallback(async () => {
    try {
      const files = await fetchFilesFromFolder();
      setAllFiles(files);
      setNewFiles(getNewFiles(files));
    } catch (err) {
      console.error('Failed to load files:', err);
    }
  }, []);

  // Check auth status on mount
  useEffect(() => {
    const checkAuth = async () => {
      if (isSignedIn()) {
        await loadFiles();
        setCurrentView(ViewState.HOME);
      }
      setIsLoading(false);
    };
    checkAuth();
  }, [loadFiles]);

  // Handle successful login
  const handleLoginSuccess = async () => {
    setIsLoading(true);
    await loadFiles();
    setCurrentView(ViewState.HOME);
    setIsLoading(false);
  };

  // Handle sign out
  const handleSignOut = () => {
    signOut();
    setCurrentView(ViewState.LOGIN);
    setAllFiles([]);
    setNewFiles([]);
  };

  // Handle navigation
  const handleNavigate = (view: ViewState, data?: DriveFile) => {
    if (data) {
      setSelectedFile(data);
    }
    setCurrentView(view);
  };

  // Update new files count after viewing
  const handleFileSeen = () => {
    setNewFiles(getNewFiles(allFiles));
  };

  // Refresh after upload
  const handleFileUploaded = async () => {
    await loadFiles();
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-amber-50 to-orange-50 flex flex-col items-center justify-center">
        <Loader2 size={80} className="text-sky-500 animate-spin mb-6" />
        <p className="text-2xl text-slate-600 font-medium">Loading...</p>
      </div>
    );
  }

  // Render current view
  const renderView = () => {
    switch (currentView) {
      case ViewState.LOGIN:
        return <Login onLoginSuccess={handleLoginSuccess} />;

      case ViewState.HOME:
        return (
          <Home
            onNavigate={handleNavigate}
            newFiles={newFiles}
            onSignOut={handleSignOut}
          />
        );

      case ViewState.NEW_FILES:
        return (
          <NewFiles
            onNavigate={handleNavigate}
            newFiles={newFiles}
          />
        );

      case ViewState.ALL_FILES:
        return (
          <AllFiles
            onNavigate={handleNavigate}
            allFiles={allFiles}
          />
        );

      case ViewState.FILE_VIEWER:
        if (!selectedFile) {
          setCurrentView(ViewState.HOME);
          return null;
        }
        return (
          <FileViewer
            onNavigate={handleNavigate}
            file={selectedFile}
            onFileSeen={handleFileSeen}
          />
        );

      case ViewState.UPLOAD:
        return (
          <Upload
            onNavigate={handleNavigate}
            onFileUploaded={handleFileUploaded}
          />
        );

      default:
        return <Login onLoginSuccess={handleLoginSuccess} />;
    }
  };

  return (
    <div className="font-sans antialiased">
      {renderView()}
    </div>
  );
};

export default App;
