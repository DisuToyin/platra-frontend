import React from 'react';
import { ChefHat, Loader2, Pizza, Coffee, UtensilsCrossed } from 'lucide-react';

interface LoadingSpinnerProps {
  message?: string;
  subtitle?: string;
  variant?: 'chef' | 'loader' | 'pizza' | 'coffee' | 'utensils';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  bgColor?: string;
  textColor?: string;
  iconColor?: string;
  fullScreen?: boolean;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  message = 'Loading menu...',
  subtitle = 'Getting the freshest options ready for you',
  variant = 'chef',
  size = 'md',
  bgColor = 'bg-gray-50',
  textColor = 'text-gray-600',
  iconColor = 'text-blue-600',
  fullScreen = true,
}) => {
  // Icon size mapping
  const iconSizes = {
    sm: 'h-8 w-8',
    md: 'h-16 w-16',
    lg: 'h-24 w-24',
    xl: 'h-32 w-32',
  };

  // Text size mapping
  const textSizes = {
    sm: { main: 'text-sm', sub: 'text-xs' },
    md: { main: 'text-lg', sub: 'text-sm' },
    lg: { main: 'text-xl', sub: 'text-base' },
    xl: { main: 'text-2xl', sub: 'text-lg' },
  };

  // Icon component mapping
  const icons = {
    chef: ChefHat,
    loader: Loader2,
    pizza: Pizza,
    coffee: Coffee,
    utensils: UtensilsCrossed,
  };

  const IconComponent = icons[variant];
  const iconSize = iconSizes[size];
  const textSize = textSizes[size];

  const content = (
    <div className="text-center space-y-4">
      <IconComponent 
        className={`${iconSize} animate-spin ${iconColor} mx-auto`} 
      />
      <p className={`${textSize.main} font-medium ${textColor}`}>
        {message}
      </p>
      {subtitle && (
        <p className={`${textSize.sub} text-gray-500`}>
          {subtitle}
        </p>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${bgColor}`}>
        {content}
      </div>
    );
  }

  return content;
};

export default LoadingSpinner;