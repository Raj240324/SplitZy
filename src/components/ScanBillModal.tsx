import { useState, useRef } from 'react';
import { createWorker } from 'tesseract.js';
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
    setProgress(0);

    try {
      // Tesseract.js v5 style
      const worker = await createWorker('eng', 1, {
        logger: (m) => {
          if (m.status === 'recognizing text') {
            setProgress(Math.round(m.progress * 100));
          }
        },
      });
      
      const { data: { text } } = await worker.recognize(image);
      await worker.terminate();

      // Simple heuristic parsing
      const lines = text.split('\n').filter(line => line.trim());
      
      // Attempt to find total amount
      // Looking for numbers with decimal points, often associated with words like "Total", "Amount", "Due"
      const numberRegex = /(\d+\.\d{2})/;
      let maxAmount = 0;
      let probableTitle = '';

      // Try to find merchant name (usually first non-empty line)
      if (lines.length > 0) {
        probableTitle = lines[0].substring(0, 30).trim(); // Likely merchant name
      }

      // Find the largest number which is typically the total
      // Prioritize lines containing "Total"
      lines.forEach(line => {
        const match = line.match(numberRegex);
        if (match) {
          const value = parseFloat(match[1]);
          if (!isNaN(value)) {
            // Boost confidence if line contains "Total"
            if (line.toLowerCase().includes('total') || line.toLowerCase().includes('amount')) {
               if (value > maxAmount) maxAmount = value;
            } else {
               // Otherwise track max seen, but be careful of sub-totals
               if (value > maxAmount) maxAmount = value;
            }
          }
        }
      });

      if (maxAmount > 0) {
        toast({
            title: "Scan Successful",
            description: `Found amount: ${maxAmount}`,
        });
        onScanComplete({ amount: maxAmount, title: probableTitle || 'Scanned Receipt' });
        handleClose();
      } else {
        toast({
            title: "Scan Incomplete",
            description: "Could not detect a valid total amount. Please enter manually.",
            variant: "destructive"
        });
        // Still proceed with what we have (title)
        onScanComplete({ title: probableTitle || 'Scanned Receipt' });
        handleClose();
      }

    } catch (error) {
      console.error(error);
      toast({
        title: "Scan Failed",
        description: "Error processing image. Please try again.",
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
