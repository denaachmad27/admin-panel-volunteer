import React, { useState } from 'react';
import { Shield, Building } from 'lucide-react';
import { constructImageUrl } from '../../utils/urlHelper';

const LogoDisplay = ({ 
  logoUrl, 
  siteName = 'Admin Panel', 
  organization = 'Bantuan Sosial',
  size = 'md',
  className = '',
  showText = true,
  textColor = 'text-white',
  fallbackIcon: FallbackIcon = Shield
}) => {
  const [imageError, setImageError] = useState(false);
  
  // Reset error state when logoUrl changes
  React.useEffect(() => {
    console.log('LogoDisplay: logoUrl changed to:', logoUrl);
    setImageError(false);
  }, [logoUrl]);

  // Debug render
  React.useEffect(() => {
    console.log('LogoDisplay: Component rendered with props:', {
      logoUrl,
      siteName,
      organization,
      size,
      showText
    });
  });

  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-10 h-10',
    lg: 'w-16 h-16',
    xl: 'w-20 h-20'
  };

  const iconSizes = {
    sm: 'w-3 h-3',
    md: 'w-5 h-5',
    lg: 'w-8 h-8',
    xl: 'w-10 h-10'
  };

  const textSizes = {
    sm: 'text-sm',
    md: 'text-lg',
    lg: 'text-3xl',
    xl: 'text-4xl'
  };

  const subtextSizes = {
    sm: 'text-xs',
    md: 'text-xs',
    lg: 'text-sm',
    xl: 'text-base'
  };


  const handleImageError = () => {
    setImageError(true);
  };

  const renderLogo = () => {
    const fullLogoUrl = constructImageUrl(logoUrl);
    console.log('LogoDisplay render:', { logoUrl, fullLogoUrl, imageError, siteName });
    
    if (fullLogoUrl && !imageError) {
      return (
        <img 
          key={fullLogoUrl} // Force re-render when URL changes
          src={fullLogoUrl} 
          alt={`${siteName} Logo`}
          className={`${sizeClasses[size]} object-cover rounded-xl`}
          onError={handleImageError}
          onLoad={() => setImageError(false)}
        />
      );
    }

    // Fallback to icon
    return (
      <div className={`${sizeClasses[size]} bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center`}>
        <FallbackIcon className={`${iconSizes[size]} text-white`} />
      </div>
    );
  };

  return (
    <div className={`flex items-center space-x-3 ${className}`}>
      {renderLogo()}
      {showText && (
        <div>
          <h1 className={`${textColor} font-bold ${textSizes[size]}`}>
            {siteName}
          </h1>
          {organization && size !== 'sm' && (
            <p className={`${textColor.replace('text-', 'text-').replace('-900', '-400').replace('-800', '-400')} ${subtextSizes[size]}`}>
              {organization} v1.0
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default LogoDisplay;