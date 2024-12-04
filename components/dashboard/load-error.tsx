import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface LoadErrorProps {
  message: string;
  onRetry: () => void;
}

// Shown when a dashboard list fails to load, with a way to try again
export function LoadError({ message, onRetry }: LoadErrorProps) {
  return (
    <div role="alert" className="text-center py-20">
      <AlertTriangle className="mx-auto h-10 w-10 text-red-500 mb-3" aria-hidden="true" />
      <h3 className="text-lg font-semibold text-gray-900 mb-2">Couldn&apos;t load this page</h3>
      <p className="text-sm text-gray-600 mb-4">{message}</p>
      <Button variant="outline" onClick={onRetry}>
        Try again
      </Button>
    </div>
  );
}
