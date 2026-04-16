import { useState, useEffect, ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from './ui/button';

interface Props {
  children: ReactNode;
}

export function ErrorBoundary({ children }: Props) {
  const [hasError, setHasError] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      setHasError(true);
      setError(event.error);
    };

    window.addEventListener('error', handleError);
    return () => window.removeEventListener('error', handleError);
  }, []);

  if (hasError) {
    let errorMessage = "Something went wrong. Please try again later.";
    
    try {
      const parsed = JSON.parse(error?.message || "");
      if (parsed.error && parsed.error.includes("insufficient permissions")) {
        errorMessage = "Access Denied: You don't have permission to view or modify this data. Please ensure you are logged in with the correct account.";
      }
    } catch (e) {
      // Not a JSON error
    }

    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <div className="max-w-md w-full text-center space-y-6 p-8 rounded-2xl border bg-card shadow-xl animate-in fade-in zoom-in duration-300">
          <div className="mx-auto w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center text-destructive">
            <AlertTriangle size={32} />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-bold tracking-tight">Application Error</h2>
            <p className="text-muted-foreground">{errorMessage}</p>
          </div>
          <Button 
            onClick={() => window.location.reload()} 
            className="w-full gap-2"
          >
            <RefreshCw size={18} />
            Reload Application
          </Button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
