import React from 'react';

interface BigButtonProps {
  label: string;
  onClick: () => void;
  variant?: 'primary' | 'secondary' | 'alert' | 'back';
  icon?: React.ReactNode;
  badge?: number;
  disabled?: boolean;
}

const BigButton: React.FC<BigButtonProps> = ({ 
  label, 
  onClick, 
  variant = 'primary', 
  icon,
  badge,
  disabled = false
}) => {
  const baseStyles = `
    w-full py-8 px-6 rounded-3xl text-3xl font-bold
    flex items-center justify-center gap-4
    transition-all duration-200 ease-out
    active:scale-[0.98] 
    disabled:opacity-50 disabled:cursor-not-allowed
    shadow-lg hover:shadow-xl
    relative overflow-hidden
  `;

  const variantStyles = {
    primary: `
      bg-gradient-to-b from-sky-500 to-sky-600
      text-white
      border-4 border-sky-400
      hover:from-sky-400 hover:to-sky-500
    `,
    secondary: `
      bg-gradient-to-b from-emerald-500 to-emerald-600
      text-white
      border-4 border-emerald-400
      hover:from-emerald-400 hover:to-emerald-500
    `,
    alert: `
      bg-gradient-to-b from-rose-500 to-rose-600
      text-white
      border-4 border-rose-400
      hover:from-rose-400 hover:to-rose-500
      animate-pulse
    `,
    back: `
      bg-gradient-to-b from-slate-200 to-slate-300
      text-slate-700
      border-4 border-slate-300
      hover:from-slate-100 hover:to-slate-200
    `
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${variantStyles[variant]}`}
    >
      {icon && <span className="flex-shrink-0">{icon}</span>}
      <span>{label}</span>
      {badge !== undefined && badge > 0 && (
        <span className="absolute top-3 right-3 bg-white text-rose-600 text-xl font-black px-4 py-1 rounded-full shadow-md">
          {badge}
        </span>
      )}
    </button>
  );
};

export default BigButton;
