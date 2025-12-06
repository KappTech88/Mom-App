import React from 'react';
import { ViewState, DriveFile, getFileCategory } from '../types';
import BigButton from '../components/BigButton';
import { ArrowLeft, FolderOpen } from 'lucide-react';
import { getSeenFileIds } from '../services/googleDriveService';

interface AllFilesProps {
  onNavigate: (view: ViewState, data?: DriveFile) => void;
  allFiles: DriveFile[];
}

const AllFiles: React.FC<AllFilesProps> = ({ onNavigate, allFiles }) => {
  const seenIds = getSeenFileIds();

  const handleFileClick = (file: DriveFile) => {
    onNavigate(ViewState.FILE_VIEWER, file);
  };

  if (allFiles.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-amber-50 to-orange-50 p-6">
        <div className="max-w-lg mx-auto text-center py-16">
          <FolderOpen size={100} className="text-slate-300 mx-auto mb-6" />
          <h1 className="text-3xl font-black text-slate-600 mb-4">
            No Files Yet
          </h1>
          <p className="text-xl text-slate-400 mb-12">
            Files shared with you will appear here
          </p>
          <BigButton
            label="Go Back"
            onClick={() => onNavigate(ViewState.HOME)}
            variant="back"
            icon={<ArrowLeft size={36} />}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-orange-50 p-6">
      <div className="max-w-lg mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-black text-slate-800 mb-2">
            📁 All Files
          </h1>
          <p className="text-xl text-slate-500">
            {allFiles.length} file{allFiles.length !== 1 ? 's' : ''}
          </p>
        </div>

        {/* File List */}
        <div className="space-y-4 mb-8">
          {allFiles.map((file) => {
            const category = getFileCategory(file.mimeType);
            const isNew = !seenIds.has(file.id);
            const dateStr = new Date(file.createdTime).toLocaleDateString(undefined, {
              month: 'short',
              day: 'numeric'
            });

            return (
              <button
                key={file.id}
                onClick={() => handleFileClick(file)}
                className={`w-full bg-white rounded-2xl p-5 shadow-md
                         flex items-center gap-4 text-left
                         hover:shadow-lg transition-all
                         active:scale-[0.98]
                         ${isNew ? 'border-2 border-rose-300 ring-2 ring-rose-100' : 'border border-slate-100'}`}
              >
                {/* File Icon */}
                <div className="text-4xl flex-shrink-0">
                  {category.icon}
                </div>

                {/* File Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-xl font-bold text-slate-800 truncate">
                      {file.name}
                    </p>
                    {isNew && (
                      <span className="bg-rose-500 text-white text-xs font-bold px-2 py-0.5 rounded-full flex-shrink-0">
                        NEW
                      </span>
                    )}
                  </div>
                  <p className="text-base text-slate-400">
                    {category.label} • {dateStr}
                  </p>
                </div>

                {/* Arrow */}
                <div className="text-slate-300 flex-shrink-0">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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

export default AllFiles;
