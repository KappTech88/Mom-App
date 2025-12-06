import React, { useEffect, useState } from 'react';
import { ViewState, DriveFile, getFileCategory } from '../types';
import BigButton from '../components/BigButton';
import { getFileContent, markFileAsSeen } from '../services/googleDriveService';
import { ArrowLeft, ExternalLink, Loader2 } from 'lucide-react';

interface FileViewerProps {
  onNavigate: (view: ViewState) => void;
  file: DriveFile;
  onFileSeen: () => void;
}

const FileViewer: React.FC<FileViewerProps> = ({ onNavigate, file, onFileSeen }) => {
  const [contentUrl, setContentUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const category = getFileCategory(file.mimeType);

  useEffect(() => {
    // Mark as seen immediately when opened
    markFileAsSeen(file.id);
    onFileSeen();

    // Load content for images
    const loadContent = async () => {
      if (category.type === 'image') {
        try {
          const url = await getFileContent(file.id);
          setContentUrl(url);
        } catch (err) {
          setError('Could not load image');
        }
      }
      setIsLoading(false);
    };

    loadContent();

    // Cleanup blob URL on unmount
    return () => {
      if (contentUrl) {
        URL.revokeObjectURL(contentUrl);
      }
    };
  }, [file.id, category.type, onFileSeen]);

  const handleOpenExternal = () => {
    if (file.webViewLink) {
      window.open(file.webViewLink, '_blank');
    }
  };

  const dateStr = new Date(file.createdTime).toLocaleDateString(undefined, {
    weekday: 'long',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-orange-50 p-6">
      <div className="max-w-2xl mx-auto">
        {/* File Header */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-4xl">{category.icon}</span>
            <span className="text-lg text-slate-400 font-medium">{category.label}</span>
          </div>
          <h1 className="text-3xl font-black text-slate-800 break-words">
            {file.name}
          </h1>
          <p className="text-xl text-slate-500 mt-2">
            {dateStr}
          </p>
        </div>

        {/* Content Area */}
        <div className="bg-white rounded-3xl shadow-xl border-2 border-slate-100 overflow-hidden mb-8">
          {isLoading ? (
            <div className="flex items-center justify-center py-24">
              <Loader2 size={64} className="text-sky-500 animate-spin" />
            </div>
          ) : error ? (
            <div className="flex items-center justify-center py-24">
              <p className="text-xl text-slate-400">{error}</p>
            </div>
          ) : category.type === 'image' && contentUrl ? (
            <img
              src={contentUrl}
              alt={file.name}
              className="w-full h-auto max-h-[70vh] object-contain bg-slate-100"
            />
          ) : category.type === 'video' ? (
            <div className="p-12 text-center">
              <div className="text-8xl mb-6">🎬</div>
              <p className="text-2xl text-slate-600 mb-2">Video File</p>
              <p className="text-lg text-slate-400">Tap "Open in Browser" to watch</p>
            </div>
          ) : category.type === 'audio' ? (
            <div className="p-12 text-center">
              <div className="text-8xl mb-6">🎵</div>
              <p className="text-2xl text-slate-600 mb-2">Audio File</p>
              <p className="text-lg text-slate-400">Tap "Open in Browser" to listen</p>
            </div>
          ) : (
            <div className="p-12 text-center">
              <div className="text-8xl mb-6">{category.icon}</div>
              <p className="text-2xl text-slate-600 mb-2">{category.label}</p>
              <p className="text-lg text-slate-400">Tap "Open in Browser" to view</p>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="space-y-4">
          {file.webViewLink && (
            <BigButton
              label="Open in Browser"
              onClick={handleOpenExternal}
              variant="primary"
              icon={<ExternalLink size={36} />}
            />
          )}

          <BigButton
            label="Go Back"
            onClick={() => onNavigate(ViewState.HOME)}
            variant="back"
            icon={<ArrowLeft size={36} />}
          />
        </div>
      </div>
    </div>
  );
};

export default FileViewer;
