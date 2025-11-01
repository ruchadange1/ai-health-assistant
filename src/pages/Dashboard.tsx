import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Activity, Brain, Camera, LogOut, User, TrendingUp, FileText, Bell } from "lucide-react";
import { Session } from "@supabase/supabase-js";
import ProfileEditor from "@/components/ProfileEditor";
import HealthProgress from "@/components/HealthProgress";
import ReportsHistory from "@/components/ReportsHistory";
import ChatBot from "@/components/ChatBot";
import HealthTips from "@/components/HealthTips";

const Dashboard = () => {
  const navigate = useNavigate();
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setLoading(false);
        if (!session) {
          navigate("/auth");
        }
      }
    );

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
      if (!session) {
        navigate("/auth");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast.success("Logged out successfully");
    navigate("/auth");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      <header className="bg-card shadow-soft border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-primary rounded-xl">
              <Activity className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-semibold">Health Predictor</h1>
              <p className="text-sm text-muted-foreground">AI-Powered Health Insights</p>
            </div>
          </div>
          <Button
            onClick={handleLogout}
            variant="outline"
            className="gap-2"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-2">Welcome Back!</h2>
          <p className="text-muted-foreground">Manage your health insights and track your progress</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <Card className="shadow-medium hover:shadow-elevated transition-smooth cursor-pointer group"
                onClick={() => navigate("/risk-prediction")}>
            <CardHeader>
              <div className="p-3 bg-gradient-primary rounded-xl w-fit mb-2 group-hover:scale-110 transition-smooth">
                <Brain className="w-6 h-6 text-primary-foreground" />
              </div>
              <CardTitle>Disease Risk Prediction</CardTitle>
              <CardDescription>
                Analyze face, voice, and lifestyle for health risk assessment
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full gradient-primary">Start Analysis</Button>
            </CardContent>
          </Card>

          <Card className="shadow-medium hover:shadow-elevated transition-smooth cursor-pointer group"
                onClick={() => navigate("/skin-tracker")}>
            <CardHeader>
              <div className="p-3 bg-gradient-secondary rounded-xl w-fit mb-2 group-hover:scale-110 transition-smooth">
                <Camera className="w-6 h-6 text-secondary-foreground" />
              </div>
              <CardTitle>Skin Health Tracker</CardTitle>
              <CardDescription>
                Track facial and skin health trends over time
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full gradient-secondary">Track Health</Button>
            </CardContent>
          </Card>

          <HealthTips />
        </div>

        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 lg:w-auto lg:inline-grid">
            <TabsTrigger value="profile" className="gap-2">
              <User className="w-4 h-4" />
              Profile
            </TabsTrigger>
            <TabsTrigger value="progress" className="gap-2">
              <TrendingUp className="w-4 h-4" />
              Progress
            </TabsTrigger>
            <TabsTrigger value="reports" className="gap-2">
              <FileText className="w-4 h-4" />
              Reports
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile">
            <ProfileEditor userId={session.user.id} />
          </TabsContent>

          <TabsContent value="progress">
            <HealthProgress userId={session.user.id} />
          </TabsContent>

          <TabsContent value="reports">
            <ReportsHistory userId={session.user.id} />
          </TabsContent>
        </Tabs>
      </main>

      <ChatBot />
    </div>
  );
};

export default Dashboard;
