export enum ViewState {
  LOGIN = 'LOGIN',
  HOME = 'HOME',
  NEW_FILES = 'NEW_FILES',
  ALL_FILES = 'ALL_FILES',
  FILE_VIEWER = 'FILE_VIEWER',
  UPLOAD = 'UPLOAD'
}

export interface DriveFile {
  id: string;
  name: string;
  mimeType: string;
  webViewLink?: string;
  webContentLink?: string;
  thumbnailLink?: string;
  createdTime: string;
  modifiedTime: string;
}

export interface FileCategory {
  type: 'image' | 'video' | 'audio' | 'document' | 'link' | 'other';
  icon: string;
  label: string;
}

export const getFileCategory = (mimeType: string): FileCategory => {
  if (mimeType.startsWith('image/')) {
    return { type: 'image', icon: '🖼️', label: 'Photo' };
  }
  if (mimeType.startsWith('video/')) {
    return { type: 'video', icon: '🎬', label: 'Video' };
  }
  if (mimeType.startsWith('audio/')) {
    return { type: 'audio', icon: '🎵', label: 'Audio' };
  }
  if (mimeType.includes('pdf')) {
    return { type: 'document', icon: '📄', label: 'PDF' };
  }
  if (mimeType.includes('document') || mimeType.includes('word') || mimeType.includes('text')) {
    return { type: 'document', icon: '📝', label: 'Document' };
  }
  if (mimeType.includes('spreadsheet') || mimeType.includes('excel')) {
    return { type: 'document', icon: '📊', label: 'Spreadsheet' };
  }
  if (mimeType.includes('presentation') || mimeType.includes('powerpoint')) {
    return { type: 'document', icon: '📽️', label: 'Presentation' };
  }
  if (mimeType.includes('shortcut') || mimeType.includes('link')) {
    return { type: 'link', icon: '🔗', label: 'Link' };
  }
  return { type: 'other', icon: '📎', label: 'File' };
};
