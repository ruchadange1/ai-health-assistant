import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Activity, Brain, Camera, Shield, TrendingUp, FileText } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        navigate("/dashboard");
      }
    };
    checkAuth();
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      <header className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-primary rounded-xl">
              <Activity className="w-6 h-6 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold">Health Predictor</span>
          </div>
          <Button onClick={() => navigate("/auth")} variant="outline">
            Sign In
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-16">
        <div className="text-center max-w-4xl mx-auto mb-16">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-hero bg-clip-text text-transparent">
            AI-Powered Multi-Modal Health Insights
          </h1>
          <p className="text-xl text-muted-foreground mb-8">
            Analyze your face, voice, and lifestyle to predict potential health risks and track your wellness journey.
          </p>
          <div className="flex gap-4 justify-center">
            <Button onClick={() => navigate("/auth")} size="lg" className="gradient-primary hover:opacity-90 transition-smooth">
              Get Started Free
            </Button>
            <Button onClick={() => navigate("/auth")} size="lg" variant="outline">
              Learn More
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          <div className="p-6 bg-card rounded-xl shadow-medium hover:shadow-elevated transition-smooth">
            <div className="p-3 bg-gradient-primary rounded-xl w-fit mb-4">
              <Brain className="w-6 h-6 text-primary-foreground" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Disease Risk Prediction</h3>
            <p className="text-muted-foreground">
              Advanced AI analyzes facial features, voice patterns, and lifestyle data to identify potential health risks.
            </p>
          </div>

          <div className="p-6 bg-card rounded-xl shadow-medium hover:shadow-elevated transition-smooth">
            <div className="p-3 bg-gradient-secondary rounded-xl w-fit mb-4">
              <Camera className="w-6 h-6 text-secondary-foreground" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Skin Health Tracking</h3>
            <p className="text-muted-foreground">
              Monitor dark circles, hydration levels, and skin health trends with visual AI analysis over time.
            </p>
          </div>

          <div className="p-6 bg-card rounded-xl shadow-medium hover:shadow-elevated transition-smooth">
            <div className="p-3 bg-gradient-primary rounded-xl w-fit mb-4">
              <TrendingUp className="w-6 h-6 text-primary-foreground" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Progress Analytics</h3>
            <p className="text-muted-foreground">
              Visualize your health journey with interactive charts and personalized insights.
            </p>
          </div>

          <div className="p-6 bg-card rounded-xl shadow-medium hover:shadow-elevated transition-smooth">
            <div className="p-3 bg-gradient-secondary rounded-xl w-fit mb-4">
              <FileText className="w-6 h-6 text-secondary-foreground" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Detailed Reports</h3>
            <p className="text-muted-foreground">
              Generate comprehensive PDF reports with charts, recommendations, and health tips.
            </p>
          </div>

          <div className="p-6 bg-card rounded-xl shadow-medium hover:shadow-elevated transition-smooth">
            <div className="p-3 bg-gradient-primary rounded-xl w-fit mb-4">
              <Activity className="w-6 h-6 text-primary-foreground" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Real-time Analysis</h3>
            <p className="text-muted-foreground">
              Live camera and voice capture with instant AI-powered health assessments.
            </p>
          </div>

          <div className="p-6 bg-card rounded-xl shadow-medium hover:shadow-elevated transition-smooth">
            <div className="p-3 bg-gradient-secondary rounded-xl w-fit mb-4">
              <Shield className="w-6 h-6 text-secondary-foreground" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Privacy First</h3>
            <p className="text-muted-foreground">
              Your health data is encrypted and securely stored with complete privacy protection.
            </p>
          </div>
        </div>

        <div className="text-center bg-card p-12 rounded-2xl shadow-elevated">
          <h2 className="text-3xl font-bold mb-4">Ready to start your health journey?</h2>
          <p className="text-muted-foreground mb-6 text-lg">
            Join thousands of users taking control of their health with AI-powered insights.
          </p>
          <Button onClick={() => navigate("/auth")} size="lg" className="gradient-primary">
            Get Started Now
          </Button>
        </div>
      </main>

      <footer className="container mx-auto px-4 py-8 mt-16 border-t">
        <p className="text-center text-muted-foreground">
          © 2025 Health Predictor. AI-powered health insights platform.
        </p>
      </footer>
    </div>
  );
};

export default Index;
