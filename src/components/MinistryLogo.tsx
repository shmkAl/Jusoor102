import React, { useState } from 'react';

interface MinistryLogoProps {
  className?: string;
  variant?: 'color' | 'dark' | 'white';
  showContainer?: boolean;
}

export const MinistryOfEducationLogo: React.FC<MinistryLogoProps> = ({
  className = 'h-10',
  variant = 'color',
  showContainer = false,
}) => {
  const [imgSrc, setImgSrc] = useState<string>('/moe_logo.png');

  // If local fails or in case of dynamic path, fall back to official CDN
  const handleImgError = () => {
    if (imgSrc !== 'https://upload.wikimedia.org/wikipedia/ar/1/17/Saudi_Ministry_of_Education_Logo_2025.png') {
      setImgSrc('https://upload.wikimedia.org/wikipedia/ar/1/17/Saudi_Ministry_of_Education_Logo_2025.png');
    }
  };

  const isDark = variant === 'dark' || variant === 'white';

  if (showContainer || isDark) {
    return (
      <div className={`inline-flex items-center justify-center p-1 bg-white/95 rounded-lg shadow-xs backdrop-blur-xs select-none ${className}`}>
        <img
          src={imgSrc}
          alt="شعار وزارة التعليم - المملكة العربية السعودية"
          className="h-full w-auto max-h-full object-contain"
          onError={handleImgError}
          referrerPolicy="no-referrer"
          loading="eager"
        />
      </div>
    );
  }

  return (
    <div className={`inline-flex items-center select-none ${className}`}>
      <img
        src={imgSrc}
        alt="شعار وزارة التعليم - المملكة العربية السعودية"
        className="h-full w-auto max-h-full object-contain"
        onError={handleImgError}
        referrerPolicy="no-referrer"
        loading="eager"
      />
    </div>
  );
};
