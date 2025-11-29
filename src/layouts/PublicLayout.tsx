import React from 'react';

interface PublicLayoutProps {
  children: React.ReactNode;
}

const PublicLayout = ({ children }: PublicLayoutProps) => {

  return (
    <div className="min-h-screen flex items-center justify-center">
    {children}
    </div>

  );
};

export default PublicLayout;