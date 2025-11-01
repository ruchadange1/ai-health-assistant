import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileText, Download, Calendar, Activity } from "lucide-react";
import { toast } from "sonner";

interface ReportsHistoryProps {
  userId: string;
}

const ReportsHistory = ({ userId }: ReportsHistoryProps) => {
  const [assessments, setAssessments] = useState<any[]>([]);

  useEffect(() => {
    loadAssessments();
  }, [userId]);

  const loadAssessments = async () => {
    const { data, error } = await supabase
      .from("health_assessments")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (data) {
      setAssessments(data);
    }
  };

  const downloadReport = async (assessment: any) => {
    toast.success("Generating PDF report...");
    // PDF generation would be implemented here
  };

  if (assessments.length === 0) {
    return (
      <Card className="shadow-medium">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-primary rounded-lg">
              <FileText className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <CardTitle>Health Reports</CardTitle>
              <CardDescription>View and download your assessment history</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <FileText className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No reports yet</h3>
            <p className="text-muted-foreground">
              Complete a health assessment to generate your first report
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-medium">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-primary rounded-lg">
            <FileText className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <CardTitle>Health Reports</CardTitle>
            <CardDescription>View and download your assessment history</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {assessments.map((assessment) => (
            <div
              key={assessment.id}
              className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-smooth"
            >
              <div className="flex items-center gap-4">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Activity className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h4 className="font-semibold capitalize">{assessment.assessment_type}</h4>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="w-3 h-3" />
                    {new Date(assessment.created_at!).toLocaleDateString()}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Badge variant={assessment.risk_score && assessment.risk_score > 50 ? "destructive" : "secondary"}>
                  Risk: {assessment.risk_score || 0}%
                </Badge>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => downloadReport(assessment)}
                  className="gap-2"
                >
                  <Download className="w-4 h-4" />
                  Download
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ReportsHistory;
