import React, { useEffect, useState } from 'react';
import BigButton from '../components/BigButton';
import { initGoogleAuth, setupTokenClient, signIn } from '../services/googleAuthService';
import { LogIn, Loader2, Heart } from 'lucide-react';

interface LoginProps {
  onLoginSuccess: () => void;
}

const Login: React.FC<LoginProps> = ({ onLoginSuccess }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const init = async () => {
      try {
        await initGoogleAuth();
        setupTokenClient(
          () => {
            onLoginSuccess();
          },
          (err) => {
            setError(err);
          }
        );
        setIsLoading(false);
      } catch (err) {
        setError('Could not connect to Google. Please try again.');
        setIsLoading(false);
      }
    };
    init();
  }, [onLoginSuccess]);

  const handleSignIn = () => {
    setError(null);
    signIn();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-amber-50 to-orange-50 flex flex-col items-center justify-center p-8">
        <Loader2 size={80} className="text-sky-500 animate-spin mb-6" />
        <p className="text-2xl text-slate-600 font-medium">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-orange-50 flex flex-col items-center justify-center p-8">
      {/* Welcome Header */}
      <div className="text-center mb-12">
        <div className="mb-6">
          <Heart size={80} className="text-rose-400 mx-auto" fill="currentColor" />
        </div>
        <h1 className="text-5xl font-black text-slate-800 mb-4">
          ParentLink
        </h1>
        <p className="text-2xl text-slate-600">
          Photos & files from family
        </p>
      </div>

      {/* Login Button */}
      <div className="w-full max-w-md">
        <BigButton
          label="Sign In with Google"
          onClick={handleSignIn}
          variant="primary"
          icon={<LogIn size={40} />}
        />
      </div>

      {/* Error Message */}
      {error && (
        <div className="mt-8 bg-rose-100 border-2 border-rose-300 rounded-2xl p-6 max-w-md">
          <p className="text-xl text-rose-700 text-center font-medium">
            {error}
          </p>
        </div>
      )}

      {/* Footer */}
      <p className="mt-16 text-lg text-slate-400">
        Made with love ❤️
      </p>
    </div>
  );
};

export default Login;
