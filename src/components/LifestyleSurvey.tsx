import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Card, CardContent } from "@/components/ui/card";

interface LifestyleSurveyProps {
  onComplete: (data: any) => void;
}

const questions = [
  { id: "sleep", label: "Sleep Quality (hours per night)", min: 0, max: 12, unit: "hours" },
  { id: "exercise", label: "Exercise Frequency (days per week)", min: 0, max: 7, unit: "days" },
  { id: "stress", label: "Stress Level", min: 0, max: 10, unit: "" },
  { id: "water", label: "Water Intake (glasses per day)", min: 0, max: 15, unit: "glasses" },
  { id: "smoking", label: "Smoking (cigarettes per day)", min: 0, max: 40, unit: "cigarettes" },
  { id: "alcohol", label: "Alcohol Consumption (drinks per week)", min: 0, max: 20, unit: "drinks" },
];

const LifestyleSurvey = ({ onComplete }: LifestyleSurveyProps) => {
  const [answers, setAnswers] = useState<Record<string, number>>(
    questions.reduce((acc, q) => ({ ...acc, [q.id]: q.min }), {})
  );

  const handleChange = (id: string, value: number[]) => {
    const newAnswers = { ...answers, [id]: value[0] };
    setAnswers(newAnswers);
    onComplete(newAnswers);
  };

  return (
    <div className="space-y-6">
      {questions.map((question) => (
        <Card key={question.id} className="shadow-soft">
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <Label className="text-base font-medium">{question.label}</Label>
                <span className="text-lg font-semibold text-primary">
                  {answers[question.id]} {question.unit}
                </span>
              </div>
              <Slider
                value={[answers[question.id]]}
                onValueChange={(value) => handleChange(question.id, value)}
                min={question.min}
                max={question.max}
                step={1}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>{question.min}</span>
                <span>{question.max} {question.unit}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default LifestyleSurvey;
