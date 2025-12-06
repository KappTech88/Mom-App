import { DriveFile } from '../types';
import { getAccessToken } from './googleAuthService';

// The specific folder ID shared with mom
const FOLDER_ID = import.meta.env.VITE_DRIVE_FOLDER_ID;

const DRIVE_API_BASE = 'https://www.googleapis.com/drive/v3';

// Fetch all files from the shared folder
export const fetchFilesFromFolder = async (): Promise<DriveFile[]> => {
  const token = getAccessToken();
  if (!token) throw new Error('Not authenticated');

  const query = `'${FOLDER_ID}' in parents and trashed = false`;
  const fields = 'files(id,name,mimeType,webViewLink,webContentLink,thumbnailLink,createdTime,modifiedTime)';
  
  const url = `${DRIVE_API_BASE}/files?q=${encodeURIComponent(query)}&fields=${encodeURIComponent(fields)}&orderBy=createdTime desc`;

  const response = await fetch(url, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch files from Drive');
  }

  const data = await response.json();
  return data.files || [];
};

// Get a single file's metadata
export const getFileMetadata = async (fileId: string): Promise<DriveFile> => {
  const token = getAccessToken();
  if (!token) throw new Error('Not authenticated');

  const fields = 'id,name,mimeType,webViewLink,webContentLink,thumbnailLink,createdTime,modifiedTime';
  const url = `${DRIVE_API_BASE}/files/${fileId}?fields=${encodeURIComponent(fields)}`;

  const response = await fetch(url, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch file metadata');
  }

  return response.json();
};

// Get file content (for images, returns blob URL)
export const getFileContent = async (fileId: string): Promise<string> => {
  const token = getAccessToken();
  if (!token) throw new Error('Not authenticated');

  const url = `${DRIVE_API_BASE}/files/${fileId}?alt=media`;

  const response = await fetch(url, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch file content');
  }

  const blob = await response.blob();
  return URL.createObjectURL(blob);
};

// Get thumbnail URL with auth
export const getThumbnailUrl = (file: DriveFile): string => {
  if (file.thumbnailLink) {
    // Increase thumbnail size
    return file.thumbnailLink.replace('=s220', '=s400');
  }
  return '';
};

// Upload a file to the shared folder (optional feature for mom)
export const uploadFile = async (file: File): Promise<DriveFile> => {
  const token = getAccessToken();
  if (!token) throw new Error('Not authenticated');

  const metadata = {
    name: file.name,
    parents: [FOLDER_ID],
  };

  const form = new FormData();
  form.append('metadata', new Blob([JSON.stringify(metadata)], { type: 'application/json' }));
  form.append('file', file);

  const response = await fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id,name,mimeType,webViewLink,webContentLink,thumbnailLink,createdTime,modifiedTime', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
    body: form,
  });

  if (!response.ok) {
    throw new Error('Failed to upload file');
  }

  return response.json();
};

// Local storage for tracking seen files
const SEEN_FILES_KEY = 'parentlink_seen_files';

export const getSeenFileIds = (): Set<string> => {
  const stored = localStorage.getItem(SEEN_FILES_KEY);
  if (!stored) return new Set();
  return new Set(JSON.parse(stored));
};

export const markFileAsSeen = (fileId: string): void => {
  const seen = getSeenFileIds();
  seen.add(fileId);
  localStorage.setItem(SEEN_FILES_KEY, JSON.stringify([...seen]));
};

export const getNewFiles = (allFiles: DriveFile[]): DriveFile[] => {
  const seen = getSeenFileIds();
  return allFiles.filter(file => !seen.has(file.id));
};

export const getNewFileCount = (allFiles: DriveFile[]): number => {
  return getNewFiles(allFiles).length;
};
