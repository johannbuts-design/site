import { ReactNode } from 'react';

interface PageContainerProps {
  children: ReactNode;
  title?: string;
  subtitle?: string;
}

export function PageContainer({ children, title, subtitle }: PageContainerProps) {
  return (
    <div className="min-h-screen pb-24 md:pt-24 md:pb-8">
      <div className="container mx-auto px-4 py-6">
        {(title || subtitle) && (
          <header className="mb-6 animate-fade-in">
            {title && (
              <h1 className="text-2xl md:text-3xl font-bold text-foreground">{title}</h1>
            )}
            {subtitle && (
              <p className="text-muted-foreground mt-1">{subtitle}</p>
            )}
          </header>
        )}
        {children}
      </div>
    </div>
  );
}
