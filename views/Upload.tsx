import React, { useState, useRef } from 'react';
import { ViewState } from '../types';
import BigButton from '../components/BigButton';
import { uploadFile } from '../services/googleDriveService';
import { ArrowLeft, Upload as UploadIcon, CheckCircle, Loader2 } from 'lucide-react';

interface UploadProps {
  onNavigate: (view: ViewState) => void;
  onFileUploaded: () => void;
}

const Upload: React.FC<UploadProps> = ({ onNavigate, onFileUploaded }) => {
  const [isUploading, setIsUploading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;

    const file = e.target.files[0];
    setIsUploading(true);
    setError(null);

    try {
      await uploadFile(file);
      setSuccess(true);
      onFileUploaded();

      // Navigate home after success
      setTimeout(() => {
        onNavigate(ViewState.HOME);
      }, 2000);
    } catch (err) {
      setError('Could not upload file. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const triggerSelect = () => {
    fileInputRef.current?.click();
  };

  // Success State
  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-green-50 flex flex-col items-center justify-center p-8">
        <CheckCircle size={120} className="text-emerald-500 mb-8" />
        <h2 className="text-4xl font-black text-emerald-700 mb-4">Sent!</h2>
        <p className="text-2xl text-emerald-600">Your file was shared.</p>
      </div>
    );
  }

  // Loading State
  if (isUploading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-amber-50 to-orange-50 flex flex-col items-center justify-center p-8">
        <Loader2 size={100} className="text-sky-500 animate-spin mb-8" />
        <h2 className="text-4xl font-black text-slate-700 mb-4">Sending...</h2>
        <p className="text-2xl text-slate-500">Please wait</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-orange-50 p-6">
      <div className="max-w-lg mx-auto">
        {/* Header */}
        <div className="text-center py-8 mb-4">
          <h1 className="text-3xl font-black text-slate-800 mb-4">
            Share Something
          </h1>
          <p className="text-xl text-slate-500">
            Pick a photo, video, or file to share
          </p>
        </div>

        {/* Hidden File Input */}
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileSelect}
          className="hidden"
          accept="image/*,video/*,audio/*,.pdf,.doc,.docx,.txt"
        />

        {/* Upload Button */}
        <div className="space-y-6">
          <BigButton
            label="Tap to Pick File"
            onClick={triggerSelect}
            variant="primary"
            icon={<UploadIcon size={48} />}
          />

          {/* Error Message */}
          {error && (
            <div className="bg-rose-100 border-2 border-rose-300 rounded-2xl p-6">
              <p className="text-xl text-rose-700 text-center font-medium">
                {error}
              </p>
            </div>
          )}

          {/* Back Button */}
          <BigButton
            label="Cancel"
            onClick={() => onNavigate(ViewState.HOME)}
            variant="back"
            icon={<ArrowLeft size={36} />}
          />
        </div>
      </div>
    </div>
  );
};

export default Upload;
