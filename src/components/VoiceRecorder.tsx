import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Mic, Square, Play, Pause, RotateCcw, Check } from "lucide-react";
import { toast } from "sonner";

interface VoiceRecorderProps {
  onRecordingComplete: (audioBlob: Blob) => void;
}

const VoiceRecorder = ({ onRecordingComplete }: VoiceRecorderProps) => {
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioURL, setAudioURL] = useState<string>("");
  const [isPlaying, setIsPlaying] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const audioRef = useRef<HTMLAudioElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(audioChunksRef.current, { type: "audio/webm" });
        const url = URL.createObjectURL(blob);
        setAudioBlob(blob);
        setAudioURL(url);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);

      timerRef.current = setInterval(() => {
        setRecordingTime(prev => {
          if (prev >= 15) {
            stopRecording();
            return 15;
          }
          return prev + 1;
        });
      }, 1000);
    } catch (error) {
      toast.error("Microphone access denied. Please allow microphone permissions.");
      console.error("Microphone error:", error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }
  };

  const togglePlayback = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const reset = () => {
    setAudioBlob(null);
    setAudioURL("");
    setRecordingTime(0);
    setIsPlaying(false);
  };

  const confirmRecording = () => {
    if (audioBlob) {
      onRecordingComplete(audioBlob);
      toast.success("Voice recording saved!");
    }
  };

  return (
    <Card className="shadow-medium">
      <CardContent className="p-6 space-y-4">
        <div className="bg-muted rounded-lg p-8 flex flex-col items-center justify-center min-h-[200px]">
          {isRecording ? (
            <div className="text-center">
              <div className="w-20 h-20 bg-destructive rounded-full flex items-center justify-center mb-4 animate-pulse">
                <Mic className="w-10 h-10 text-destructive-foreground" />
              </div>
              <p className="text-2xl font-bold mb-2">{recordingTime}s / 15s</p>
              <p className="text-muted-foreground">Recording...</p>
            </div>
          ) : audioBlob ? (
            <div className="text-center w-full">
              <div className="w-20 h-20 bg-secondary rounded-full flex items-center justify-center mb-4 mx-auto">
                <Mic className="w-10 h-10 text-secondary-foreground" />
              </div>
              <p className="text-lg font-semibold mb-2">Recording Complete</p>
              <p className="text-muted-foreground">{recordingTime} seconds</p>
              <audio
                ref={audioRef}
                src={audioURL}
                onEnded={() => setIsPlaying(false)}
                className="hidden"
              />
            </div>
          ) : (
            <div className="text-center">
              <Mic className="w-16 h-16 text-muted-foreground mb-4 mx-auto" />
              <p className="text-muted-foreground">Record a 10-15 second voice sample</p>
            </div>
          )}
        </div>

        <div className="flex gap-2">
          {!isRecording && !audioBlob && (
            <Button onClick={startRecording} className="w-full gradient-primary gap-2">
              <Mic className="w-4 h-4" />
              Start Recording
            </Button>
          )}

          {isRecording && (
            <Button onClick={stopRecording} variant="destructive" className="w-full gap-2">
              <Square className="w-4 h-4" />
              Stop Recording
            </Button>
          )}

          {audioBlob && (
            <>
              <Button onClick={togglePlayback} variant="outline" className="flex-1 gap-2">
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                {isPlaying ? "Pause" : "Play"}
              </Button>
              <Button onClick={reset} variant="outline" className="flex-1 gap-2">
                <RotateCcw className="w-4 h-4" />
                Re-record
              </Button>
              <Button onClick={confirmRecording} className="flex-1 gradient-primary gap-2">
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

export default VoiceRecorder;
