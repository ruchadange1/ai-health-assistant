import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { Download, Calendar, AlertTriangle, CheckCircle2, Info } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

interface RiskResultsProps {
  results: any;
  userId: string;
}

const RiskResults = ({ results }: RiskResultsProps) => {
  const navigate = useNavigate();

  const chartData = [
    { name: "Face Analysis", value: results.faceAnalysis.score, color: "hsl(var(--primary))" },
    { name: "Voice Analysis", value: results.voiceAnalysis.score, color: "hsl(var(--secondary))" },
    { name: "Lifestyle", value: results.lifestyleAnalysis.score, color: "hsl(var(--accent))" },
  ];

  const getRiskLevel = (score: number) => {
    if (score < 30) return { label: "Low", variant: "secondary" as const };
    if (score < 60) return { label: "Medium", variant: "default" as const };
    return { label: "High", variant: "destructive" as const };
  };

  const riskLevel = getRiskLevel(results.totalRiskScore);

  const downloadReport = () => {
    toast.success("Generating PDF report...");
    // PDF generation would be implemented here
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-2">Analysis Complete</h2>
        <p className="text-muted-foreground">Here are your health risk assessment results</p>
      </div>

      <Card className="shadow-medium border-2 border-primary/20">
        <CardHeader className="text-center">
          <CardTitle className="text-4xl font-bold text-primary">
            {results.totalRiskScore}%
          </CardTitle>
          <CardDescription className="text-lg">
            Overall Risk Score
            <Badge variant={riskLevel.variant} className="ml-2">
              {riskLevel.label} Risk
            </Badge>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={200}>
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
              <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card className="shadow-medium">
        <CardHeader>
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-primary" />
            <CardTitle>Potential Health Risks</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {results.predictions.map((prediction: any, index: number) => (
            <div key={index} className="p-4 border rounded-lg">
              <div className="flex items-start justify-between mb-2">
                <h4 className="font-semibold">{prediction.condition}</h4>
                <Badge variant={prediction.probability.includes("High") ? "destructive" : "secondary"}>
                  {prediction.probability}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">{prediction.description}</p>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card className="shadow-medium border-l-4 border-l-secondary">
        <CardHeader>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-secondary" />
            <CardTitle>Health Recommendations</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3">
            {results.recommendations.map((rec: string, index: number) => (
              <li key={index} className="flex items-start gap-3">
                <Info className="w-5 h-5 text-secondary mt-0.5 flex-shrink-0" />
                <span>{rec}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <div className="flex gap-3">
        <Button onClick={downloadReport} variant="outline" className="flex-1 gap-2">
          <Download className="w-4 h-4" />
          Download Report
        </Button>
        <Button onClick={() => navigate("/dashboard")} className="flex-1 gradient-primary gap-2">
          <Calendar className="w-4 h-4" />
          Back to Dashboard
        </Button>
      </div>
    </div>
  );
};

export default RiskResults;
