import { useState, useRef } from 'react';
import { Camera, Upload, Loader2, X, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';

interface ScanBillModalProps {
  open: boolean;
  onClose: () => void;
  onScanComplete: (data: { amount?: number; title?: string }) => void;
}

const ScanBillModal = ({ open, onClose, onScanComplete }: ScanBillModalProps) => {
  const [image, setImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setImage(ev.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const processImage = async () => {
    if (!image) return;

    setIsProcessing(true);
    setProgress(10); // Start progress

    try {
      const response = await fetch('/api/scan-receipt', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ image }),
      });

      setProgress(50);

      if (!response.ok) {
        throw new Error('Failed to process image');
      }

      const data = await response.json();
      setProgress(100);

      if (data.amount || data.title) {
        toast({
          title: "AI Scan Successful",
          description: `Found: ${data.title || 'Merchant'} - ${data.amount || 'Amount'}`,
        });
        onScanComplete({ 
          amount: data.amount, 
          title: data.title || 'Scanned Receipt' 
        });
        handleClose();
      } else {
        throw new Error('No data extracted');
      }
    } catch (error) {
      console.error('Scan error:', error);
      toast({
        title: "Scan Failed",
        description: "AI could not process this image. Please enter manually.",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleClose = () => {
    setImage(null);
    setIsProcessing(false);
    setProgress(0);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Scan Bill</DialogTitle>
          <DialogDescription>
            Upload or take a photo of your receipt to auto-fill details.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col items-center gap-6 py-4">
          {/* Image Preview Area */}
          <div 
            className="w-full h-64 border-2 border-dashed border-muted-foreground/25 rounded-xl flex flex-col items-center justify-center bg-muted/50 overflow-hidden relative cursor-pointer hover:bg-muted/70 transition-colors"
            onClick={() => !image && fileInputRef.current?.click()}
          >
            {image ? (
              <>
                <img src={image} alt="Preview" className="w-full h-full object-contain" />
                {!isProcessing && (
                    <Button 
                        size="icon" 
                        variant="destructive" 
                        className="absolute top-2 right-2 h-8 w-8"
                        onClick={(e) => {
                            e.stopPropagation();
                            setImage(null);
                        }}
                    >
                        <X className="w-4 h-4" />
                    </Button>
                )}
              </>
            ) : (
              <div className="text-center p-4">
                <Camera className="w-12 h-12 mx-auto mb-2 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">Click to capture or upload</p>
              </div>
            )}
            
            {isProcessing && (
                <div className="absolute inset-0 bg-background/80 flex flex-col items-center justify-center z-10">
                    <Loader2 className="w-8 h-8 animate-spin text-primary mb-2" />
                    <p className="text-sm font-medium">Processing... {progress}%</p>
                </div>
            )}
          </div>

          <input 
            type="file" 
            ref={fileInputRef} 
            className="hidden" 
            accept="image/*"
            capture="environment" // triggers camera on mobile
            onChange={handleFileChange}
          />

          <div className="flex w-full gap-2">
            {!image ? (
                 <Button className="w-full" onClick={() => fileInputRef.current?.click()}>
                    <Upload className="w-4 h-4 mr-2" />
                    Select Image
                 </Button>
            ) : (
                <Button className="w-full" onClick={processImage} disabled={isProcessing}>
                    {isProcessing ? (
                        <>Processing...</>
                    ) : (
                        <>
                            <Check className="w-4 h-4 mr-2" />
                            Extract Details
                        </>
                    )}
                </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ScanBillModal;
