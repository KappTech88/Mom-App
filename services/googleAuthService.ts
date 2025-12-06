// Google OAuth Configuration
const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;
// Combined scopes: readonly for viewing shared files, drive.file for uploads
const SCOPES = 'https://www.googleapis.com/auth/drive.readonly https://www.googleapis.com/auth/drive.file';

let tokenClient: google.accounts.oauth2.TokenClient | null = null;
let accessToken: string | null = null;

// Load the Google Identity Services library
export const initGoogleAuth = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    // Check if already loaded
    if (window.google?.accounts?.oauth2) {
      resolve();
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Failed to load Google Identity Services'));
    document.head.appendChild(script);
  });
};

// Initialize the token client
export const setupTokenClient = (onSuccess: (token: string) => void, onError: (error: string) => void) => {
  if (!window.google?.accounts?.oauth2) {
    onError('Google Identity Services not loaded');
    return;
  }

  tokenClient = window.google.accounts.oauth2.initTokenClient({
    client_id: CLIENT_ID,
    scope: SCOPES,
    callback: (response: google.accounts.oauth2.TokenResponse) => {
      if (response.error) {
        onError(response.error);
        return;
      }
      accessToken = response.access_token;
      // Store token in session
      sessionStorage.setItem('parentlink_token', accessToken);
      onSuccess(accessToken);
    },
  });
};

// Trigger sign in
export const signIn = () => {
  if (tokenClient) {
    tokenClient.requestAccessToken({ prompt: 'consent' });
  }
};

// Sign out
export const signOut = () => {
  if (accessToken) {
    window.google.accounts.oauth2.revoke(accessToken, () => {
      accessToken = null;
      sessionStorage.removeItem('parentlink_token');
    });
  }
};

// Get current access token
export const getAccessToken = (): string | null => {
  if (accessToken) return accessToken;
  return sessionStorage.getItem('parentlink_token');
};

// Check if user is signed in
export const isSignedIn = (): boolean => {
  return !!getAccessToken();
};

// Type declarations for Google Identity Services
declare global {
  interface Window {
    google: {
      accounts: {
        oauth2: {
          initTokenClient: (config: {
            client_id: string;
            scope: string;
            callback: (response: google.accounts.oauth2.TokenResponse) => void;
          }) => google.accounts.oauth2.TokenClient;
          revoke: (token: string, callback: () => void) => void;
        };
      };
    };
  }
}

declare namespace google.accounts.oauth2 {
  interface TokenClient {
    requestAccessToken: (config?: { prompt?: string }) => void;
  }
  interface TokenResponse {
    access_token: string;
    error?: string;
  }
}
