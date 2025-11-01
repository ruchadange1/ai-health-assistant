import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, Brain } from "lucide-react";
import { toast } from "sonner";
import { Session } from "@supabase/supabase-js";
import CameraCapture from "@/components/CameraCapture";
import VoiceRecorder from "@/components/VoiceRecorder";
import LifestyleSurvey from "@/components/LifestyleSurvey";
import RiskResults from "@/components/RiskResults";
import PrivacyConsent from "@/components/PrivacyConsent";

const RiskPrediction = () => {
  const navigate = useNavigate();
  const [session, setSession] = useState<Session | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [showConsent, setShowConsent] = useState(true);
  const [faceImage, setFaceImage] = useState<string>("");
  const [voiceBlob, setVoiceBlob] = useState<Blob | null>(null);
  const [surveyData, setSurveyData] = useState<any>(null);
  const [results, setResults] = useState<any>(null);

  const steps = ["Face Analysis", "Voice Analysis", "Lifestyle Survey", "Results"];
  const progress = ((currentStep + 1) / steps.length) * 100;

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        if (!session) {
          navigate("/auth");
        }
      }
    );

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (!session) {
        navigate("/auth");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleConsentAccept = () => {
    setShowConsent(false);
  };

  const analyzeData = async () => {
    // Mock AI analysis
    const faceScore = Math.floor(Math.random() * 30) + 20;
    const voiceScore = Math.floor(Math.random() * 25) + 10;
    const lifestyleScore = Math.floor(Math.random() * 35) + 20;
    const totalScore = faceScore + voiceScore + lifestyleScore;

    const analysisResults = {
      totalRiskScore: totalScore,
      faceAnalysis: {
        score: faceScore,
        findings: ["Mild dehydration detected", "Fatigue signs present", "Dark circles observed"],
      },
      voiceAnalysis: {
        score: voiceScore,
        findings: ["Normal voice patterns", "Slight stress indicators"],
      },
      lifestyleAnalysis: {
        score: lifestyleScore,
        findings: ["Improvement needed in sleep routine", "Good exercise habits"],
      },
      predictions: [
        { condition: "Chronic Fatigue Syndrome", probability: "Medium", description: "Signs of fatigue and insufficient rest" },
        { condition: "Dehydration", probability: "Low-Medium", description: "Mild dehydration indicators from facial analysis" },
        { condition: "Anxiety/Stress", probability: "Low", description: "Minor stress patterns detected in voice" },
      ],
      recommendations: [
        "Increase water intake to 2-3 liters daily",
        "Aim for 7-8 hours of quality sleep",
        "Consider stress management techniques like meditation",
        "Maintain regular exercise routine",
      ],
    };

    // Save to database
    if (session) {
      await supabase.from("health_assessments").insert({
        user_id: session.user.id,
        assessment_type: "disease_risk_prediction",
        risk_score: totalScore,
        data: analysisResults,
      });
    }

    setResults(analysisResults);
    setCurrentStep(3);
  };

  const handleNext = async () => {
    if (currentStep === 0 && !faceImage) {
      toast.error("Please capture a face photo");
      return;
    }
    if (currentStep === 1 && !voiceBlob) {
      toast.error("Please record a voice sample");
      return;
    }
    if (currentStep === 2) {
      await analyzeData();
      return;
    }
    setCurrentStep(prev => prev + 1);
  };

  const handleBack = () => {
    setCurrentStep(prev => Math.max(0, prev - 1));
  };

  if (!session) return null;
  if (showConsent) return <PrivacyConsent onAccept={handleConsentAccept} />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      <header className="bg-card shadow-soft border-b">
        <div className="container mx-auto px-4 py-4">
          <Button onClick={() => navigate("/dashboard")} variant="ghost" className="gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-gradient-primary rounded-xl">
              <Brain className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Disease Risk Prediction</h1>
              <p className="text-muted-foreground">Multi-modal AI health assessment</p>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="font-medium">{steps[currentStep]}</span>
              <span className="text-muted-foreground">Step {currentStep + 1} of {steps.length}</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        </div>

        <Card className="shadow-elevated p-6 mb-6">
          {currentStep === 0 && (
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold">Step 1: Face Photo</h2>
              <p className="text-muted-foreground">
                Capture or upload a clear photo of your face for AI analysis
              </p>
              <CameraCapture onCapture={setFaceImage} label="Capture Face Photo" />
            </div>
          )}

          {currentStep === 1 && (
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold">Step 2: Voice Sample</h2>
              <p className="text-muted-foreground">
                Record a 10-15 second voice sample for analysis
              </p>
              <VoiceRecorder onRecordingComplete={setVoiceBlob} />
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold">Step 3: Lifestyle Survey</h2>
              <p className="text-muted-foreground">
                Answer a few questions about your daily habits
              </p>
              <LifestyleSurvey onComplete={setSurveyData} />
            </div>
          )}

          {currentStep === 3 && results && (
            <RiskResults results={results} userId={session.user.id} />
          )}
        </Card>

        {currentStep < 3 && (
          <div className="flex gap-3">
            {currentStep > 0 && (
              <Button onClick={handleBack} variant="outline" className="flex-1">
                Previous
              </Button>
            )}
            <Button onClick={handleNext} className="flex-1 gradient-primary">
              {currentStep === 2 ? "Analyze" : "Next"}
            </Button>
          </div>
        )}
      </main>
    </div>
  );
};

export default RiskPrediction;
