import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from "recharts";
import { TrendingUp, Calendar } from "lucide-react";

interface HealthProgressProps {
  userId: string;
}

const HealthProgress = ({ userId }: HealthProgressProps) => {
  const [assessments, setAssessments] = useState<any[]>([]);
  const [chartData, setChartData] = useState<any[]>([]);

  useEffect(() => {
    loadAssessments();
  }, [userId]);

  const loadAssessments = async () => {
    const { data, error } = await supabase
      .from("health_assessments")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: true })
      .limit(10);

    if (data) {
      setAssessments(data);
      
      const formatted = data.map((assessment, index) => ({
        name: `Scan ${index + 1}`,
        date: new Date(assessment.created_at!).toLocaleDateString(),
        riskScore: assessment.risk_score || 0,
        type: assessment.assessment_type,
      }));
      
      setChartData(formatted);
    }
  };

  if (assessments.length === 0) {
    return (
      <Card className="shadow-medium">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-secondary rounded-lg">
              <TrendingUp className="w-5 h-5 text-secondary-foreground" />
            </div>
            <div>
              <CardTitle>Health Progress</CardTitle>
              <CardDescription>Track your health metrics over time</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <Calendar className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No health data yet</h3>
            <p className="text-muted-foreground">
              Complete a health assessment to start tracking your progress
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="shadow-medium">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-secondary rounded-lg">
              <TrendingUp className="w-5 h-5 text-secondary-foreground" />
            </div>
            <div>
              <CardTitle>Risk Score Trend</CardTitle>
              <CardDescription>Your health risk scores over time</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
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
              <Line 
                type="monotone" 
                dataKey="riskScore" 
                stroke="hsl(var(--primary))" 
                strokeWidth={2}
                name="Risk Score"
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card className="shadow-medium">
        <CardHeader>
          <CardTitle>Assessment Types</CardTitle>
          <CardDescription>Distribution of your health assessments</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={chartData}>
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
              <Bar dataKey="riskScore" fill="hsl(var(--secondary))" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};

export default HealthProgress;
