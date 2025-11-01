import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Camera, TrendingUp, Calendar } from "lucide-react";
import { toast } from "sonner";
import { Session } from "@supabase/supabase-js";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import CameraCapture from "@/components/CameraCapture";
import PrivacyConsent from "@/components/PrivacyConsent";

const SkinTracker = () => {
  const navigate = useNavigate();
  const [session, setSession] = useState<Session | null>(null);
  const [showConsent, setShowConsent] = useState(true);
  const [capturedImage, setCapturedImage] = useState<string>("");
  const [analysis, setAnalysis] = useState<any>(null);
  const [history, setHistory] = useState<any[]>([]);
  const [trendData, setTrendData] = useState<any[]>([]);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        if (!session) {
          navigate("/auth");
        } else {
          loadHistory(session.user.id);
        }
      }
    );

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (!session) {
        navigate("/auth");
      } else {
        loadHistory(session.user.id);
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const loadHistory = async (userId: string) => {
    const { data } = await supabase
      .from("health_assessments")
      .select("*")
      .eq("user_id", userId)
      .eq("assessment_type", "skin_health")
      .order("created_at", { ascending: true })
      .limit(10);

    if (data) {
      setHistory(data);
      
      const formatted = data.map((item, index) => ({
        name: `Scan ${index + 1}`,
        date: new Date(item.created_at!).toLocaleDateString(),
        darkCircles: (item.data as any)?.darkCircles || 0,
        dehydration: (item.data as any)?.dehydration || 0,
        redness: (item.data as any)?.redness || 0,
        fatigue: (item.data as any)?.fatigue || 0,
      }));
      
      setTrendData(formatted);
    }
  };

  const analyzeSkin = async () => {
    if (!capturedImage || !session) return;

    // Mock AI analysis
    const mockAnalysis = {
      darkCircles: Math.floor(Math.random() * 40) + 20,
      dehydration: Math.floor(Math.random() * 35) + 15,
      redness: Math.floor(Math.random() * 30) + 10,
      fatigue: Math.floor(Math.random() * 45) + 20,
      timestamp: new Date().toISOString(),
      insights: [
        "Dark circles have improved compared to last scan",
        "Slight dehydration detected - increase water intake",
        "Skin appears well-rested",
      ],
    };

    // Save to database
    await supabase.from("health_assessments").insert({
      user_id: session.user.id,
      assessment_type: "skin_health",
      risk_score: (mockAnalysis.darkCircles + mockAnalysis.dehydration + mockAnalysis.redness + mockAnalysis.fatigue) / 4,
      data: mockAnalysis,
    });

    setAnalysis(mockAnalysis);
    toast.success("Skin analysis complete!");
    loadHistory(session.user.id);
  };

  if (!session) return null;
  if (showConsent) return <PrivacyConsent onAccept={() => setShowConsent(false)} />;

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

      <main className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-3 bg-gradient-secondary rounded-xl">
              <Camera className="w-6 h-6 text-secondary-foreground" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Facial & Skin Health Tracker</h1>
              <p className="text-muted-foreground">Track your skin health over time with AI analysis</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div className="space-y-6">
            <Card className="shadow-medium">
              <CardHeader>
                <CardTitle>Capture New Scan</CardTitle>
                <CardDescription>Take a photo for skin health analysis</CardDescription>
              </CardHeader>
              <CardContent>
                <CameraCapture onCapture={setCapturedImage} label="Capture Face Photo" />
                {capturedImage && (
                  <Button onClick={analyzeSkin} className="w-full mt-4 gradient-secondary">
                    Analyze Skin Health
                  </Button>
                )}
              </CardContent>
            </Card>

            {analysis && (
              <Card className="shadow-medium border-l-4 border-l-secondary">
                <CardHeader>
                  <CardTitle>Latest Analysis Results</CardTitle>
                  <CardDescription>
                    {new Date(analysis.timestamp).toLocaleString()}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 bg-muted/50 rounded-lg">
                      <p className="text-sm text-muted-foreground mb-1">Dark Circles</p>
                      <div className="flex items-center justify-between">
                        <p className="text-2xl font-bold text-primary">{analysis.darkCircles}%</p>
                        <Badge variant={analysis.darkCircles > 50 ? "destructive" : "secondary"}>
                          {analysis.darkCircles > 50 ? "High" : "Low"}
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="p-3 bg-muted/50 rounded-lg">
                      <p className="text-sm text-muted-foreground mb-1">Dehydration</p>
                      <div className="flex items-center justify-between">
                        <p className="text-2xl font-bold text-primary">{analysis.dehydration}%</p>
                        <Badge variant={analysis.dehydration > 50 ? "destructive" : "secondary"}>
                          {analysis.dehydration > 50 ? "High" : "Low"}
                        </Badge>
                      </div>
                    </div>

                    <div className="p-3 bg-muted/50 rounded-lg">
                      <p className="text-sm text-muted-foreground mb-1">Redness</p>
                      <div className="flex items-center justify-between">
                        <p className="text-2xl font-bold text-primary">{analysis.redness}%</p>
                        <Badge variant={analysis.redness > 50 ? "destructive" : "secondary"}>
                          {analysis.redness > 50 ? "High" : "Low"}
                        </Badge>
                      </div>
                    </div>

                    <div className="p-3 bg-muted/50 rounded-lg">
                      <p className="text-sm text-muted-foreground mb-1">Fatigue</p>
                      <div className="flex items-center justify-between">
                        <p className="text-2xl font-bold text-primary">{analysis.fatigue}%</p>
                        <Badge variant={analysis.fatigue > 50 ? "destructive" : "secondary"}>
                          {analysis.fatigue > 50 ? "High" : "Low"}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-semibold">Insights:</h4>
                    <ul className="space-y-1">
                      {analysis.insights.map((insight: string, index: number) => (
                        <li key={index} className="text-sm flex items-start gap-2">
                          <span className="text-secondary mt-1">•</span>
                          <span>{insight}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          <div className="space-y-6">
            {trendData.length > 0 && (
              <Card className="shadow-medium">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-secondary" />
                    <CardTitle>Skin Health Trends</CardTitle>
                  </div>
                  <CardDescription>Track your progress over time</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={trendData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" />
                      <YAxis stroke="hsl(var(--muted-foreground))" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "hsl(var(--card))",
                          border: "1px solid hsl(var(--border))",
                          borderRadius: "var(--radius)",
                        }}
                      />
                      <Legend />
                      <Line type="monotone" dataKey="darkCircles" stroke="#8b5cf6" strokeWidth={2} name="Dark Circles" />
                      <Line type="monotone" dataKey="dehydration" stroke="#06b6d4" strokeWidth={2} name="Dehydration" />
                      <Line type="monotone" dataKey="redness" stroke="#ef4444" strokeWidth={2} name="Redness" />
                      <Line type="monotone" dataKey="fatigue" stroke="#f59e0b" strokeWidth={2} name="Fatigue" />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            )}

            <Card className="shadow-medium">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-primary" />
                  <CardTitle>Scan History</CardTitle>
                </div>
                <CardDescription>Your previous skin health assessments</CardDescription>
              </CardHeader>
              <CardContent>
                {history.length === 0 ? (
                  <div className="text-center py-8">
                    <Camera className="w-12 h-12 mx-auto mb-3 text-muted-foreground" />
                    <p className="text-muted-foreground">No scans yet. Take your first photo to start tracking!</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {history.slice().reverse().map((scan) => (
                      <div key={scan.id} className="p-3 border rounded-lg hover:bg-muted/50 transition-smooth">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">Scan {new Date(scan.created_at!).toLocaleDateString()}</p>
                            <p className="text-sm text-muted-foreground">
                              {new Date(scan.created_at!).toLocaleTimeString()}
                            </p>
                          </div>
                          <Badge variant="outline">
                            Score: {Math.round(scan.risk_score || 0)}%
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default SkinTracker;
