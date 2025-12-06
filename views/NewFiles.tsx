import React from 'react';
import { ViewState, DriveFile, getFileCategory } from '../types';
import BigButton from '../components/BigButton';
import { ArrowLeft } from 'lucide-react';

interface NewFilesProps {
  onNavigate: (view: ViewState, data?: DriveFile) => void;
  newFiles: DriveFile[];
}

const NewFiles: React.FC<NewFilesProps> = ({ onNavigate, newFiles }) => {
  const handleFileClick = (file: DriveFile) => {
    onNavigate(ViewState.FILE_VIEWER, file);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-orange-50 p-6">
      <div className="max-w-lg mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-black text-slate-800 mb-2">
            🔔 New Files
          </h1>
          <p className="text-xl text-slate-500">
            Tap any to open
          </p>
        </div>

        {/* File List */}
        <div className="space-y-4 mb-8">
          {newFiles.map((file) => {
            const category = getFileCategory(file.mimeType);
            const dateStr = new Date(file.createdTime).toLocaleDateString(undefined, {
              month: 'short',
              day: 'numeric'
            });

            return (
              <button
                key={file.id}
                onClick={() => handleFileClick(file)}
                className="w-full bg-white rounded-2xl p-6 shadow-lg border-2 border-sky-200 
                         flex items-center gap-4 text-left
                         hover:border-sky-400 hover:shadow-xl transition-all
                         active:scale-[0.98]"
              >
                {/* File Icon */}
                <div className="text-5xl flex-shrink-0">
                  {category.icon}
                </div>

                {/* File Info */}
                <div className="flex-1 min-w-0">
                  <p className="text-2xl font-bold text-slate-800 truncate">
                    {file.name}
                  </p>
                  <p className="text-lg text-slate-400">
                    {category.label} • {dateStr}
                  </p>
                </div>

                {/* Arrow */}
                <div className="text-sky-400 flex-shrink-0">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                </div>
              </button>
            );
          })}
        </div>

        {/* Back Button */}
        <BigButton
          label="Go Back"
          onClick={() => onNavigate(ViewState.HOME)}
          variant="back"
          icon={<ArrowLeft size={36} />}
        />
      </div>
    </div>
  );
};

export default NewFiles;
