import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Camera, Upload, RotateCcw, Check } from "lucide-react";
import { toast } from "sonner";

interface CameraCaptureProps {
  onCapture: (imageData: string) => void;
  label?: string;
}

const CameraCapture = ({ onCapture, label = "Capture Photo" }: CameraCaptureProps) => {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [stream]);

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { 
          facingMode: "user", 
          width: { ideal: 1280 },
          height: { ideal: 720 }
        },
      });
      setStream(mediaStream);
      setIsCameraActive(true);
      
      // Wait for next tick to ensure video element is ready
      setTimeout(() => {
        if (videoRef.current && mediaStream) {
          videoRef.current.srcObject = mediaStream;
          videoRef.current.play().catch(err => {
            console.error("Error playing video:", err);
          });
        }
      }, 100);
    } catch (error) {
      toast.error("Camera not accessible. Please enable permissions or upload an image instead.");
      console.error("Camera error:", error);
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    setIsCameraActive(false);
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.drawImage(video, 0, 0);
        const imageData = canvas.toDataURL("image/jpeg");
        setCapturedImage(imageData);
        stopCamera();
      }
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCapturedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const confirmCapture = () => {
    if (capturedImage) {
      onCapture(capturedImage);
      toast.success("Photo captured successfully!");
    }
  };

  const retake = () => {
    setCapturedImage(null);
    startCamera();
  };

  return (
    <Card className="shadow-medium hover-lift">
      <CardContent className="p-6 space-y-4">
        <div className="relative bg-muted rounded-xl overflow-hidden aspect-video border-2 border-border">
          {capturedImage ? (
            <img 
              src={capturedImage} 
              alt="Captured" 
              className="w-full h-full object-cover shadow-soft" 
            />
          ) : isCameraActive ? (
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover scale-x-[-1]"
            />
          ) : (
            <div className="flex items-center justify-center h-full bg-gradient-to-br from-muted to-background">
              <div className="text-center p-6">
                <Camera className="w-16 h-16 mx-auto mb-4 text-primary opacity-60" />
                <p className="text-foreground font-medium">{label}</p>
                <p className="text-sm text-muted-foreground mt-2">Click "Start Camera" or upload an image</p>
              </div>
            </div>
          )}
        </div>

        <canvas ref={canvasRef} className="hidden" />

        <div className="flex gap-3">
          {!capturedImage && !isCameraActive && (
            <>
              <Button onClick={startCamera} className="flex-1 gradient-primary gap-2 shadow-soft hover:shadow-glow transition-smooth">
                <Camera className="w-4 h-4" />
                Start Camera
              </Button>
              <label className="flex-1">
                <Button variant="outline" className="w-full gap-2 hover-lift" asChild>
                  <span>
                    <Upload className="w-4 h-4" />
                    Upload
                  </span>
                </Button>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            </>
          )}

          {isCameraActive && !capturedImage && (
            <Button onClick={capturePhoto} className="w-full gradient-primary gap-2 shadow-soft hover:shadow-glow transition-smooth">
              <Camera className="w-4 h-4" />
              Capture Photo
            </Button>
          )}

          {capturedImage && (
            <>
              <Button onClick={retake} variant="outline" className="flex-1 gap-2 hover-lift">
                <RotateCcw className="w-4 h-4" />
                Retake
              </Button>
              <Button onClick={confirmCapture} className="flex-1 gradient-primary gap-2 shadow-soft hover:shadow-glow transition-smooth">
                <Check className="w-4 h-4" />
                Confirm
              </Button>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default CameraCapture;
