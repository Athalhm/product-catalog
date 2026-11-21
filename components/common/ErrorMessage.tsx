import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
}

export function ErrorMessage({ message, onRetry }: ErrorMessageProps) {
  return (
    <Alert variant="destructive">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Gagal memuat produk</AlertTitle>
      <AlertDescription>
        <p>{message}</p>
        <p>Periksa koneksi internetmu, lalu coba lagi.</p>
        {onRetry && (
          <Button variant="outline" size="sm" className="mt-2" onClick={onRetry}>
            Coba lagi
          </Button>
        )}
      </AlertDescription>
    </Alert>
  );
}