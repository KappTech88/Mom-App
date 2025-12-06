import React from 'react';
import BigButton from '../components/BigButton';
import { ViewState, DriveFile } from '../types';
import { FolderOpen, Bell, Upload, LogOut } from 'lucide-react';

interface HomeProps {
  onNavigate: (view: ViewState, data?: DriveFile) => void;
  newFiles: DriveFile[];
  onSignOut: () => void;
}

const Home: React.FC<HomeProps> = ({ onNavigate, newFiles, onSignOut }) => {
  const newCount = newFiles.length;

  const handleNewFilesClick = () => {
    if (newCount === 1) {
      // Go directly to the single new file
      onNavigate(ViewState.FILE_VIEWER, newFiles[0]);
    } else {
      // Go to list of new files
      onNavigate(ViewState.NEW_FILES);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-orange-50 p-6">
      <div className="max-w-lg mx-auto">
        {/* Header */}
        <div className="text-center py-8 mb-4">
          <h1 className="text-4xl font-black text-slate-800 mb-2">
            Welcome! 👋
          </h1>
          <p className="text-xl text-slate-500">
            What would you like to do?
          </p>
        </div>

        {/* Main Buttons */}
        <div className="space-y-6">
          
          {/* New Files Button - Only shows if there are new files */}
          {newCount > 0 && (
            <BigButton
              label={newCount === 1 ? '1 New File!' : `${newCount} New Files!`}
              onClick={handleNewFilesClick}
              variant="alert"
              icon={<Bell size={44} />}
            />
          )}

          {/* View All Files */}
          <BigButton
            label="View All Files"
            onClick={() => onNavigate(ViewState.ALL_FILES)}
            variant="secondary"
            icon={<FolderOpen size={44} />}
          />

          {/* Share Something (optional) */}
          <BigButton
            label="Share Something"
            onClick={() => onNavigate(ViewState.UPLOAD)}
            variant="primary"
            icon={<Upload size={44} />}
          />
        </div>

        {/* Sign Out */}
        <div className="mt-16">
          <button
            onClick={onSignOut}
            className="w-full py-4 text-slate-400 text-xl flex items-center justify-center gap-2 hover:text-slate-600 transition-colors"
          >
            <LogOut size={24} />
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;
