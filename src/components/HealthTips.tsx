import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Lightbulb, Droplet, Moon, Apple } from "lucide-react";

const tips = [
  { icon: Droplet, text: "Drink 8-10 glasses of water daily", color: "text-blue-500" },
  { icon: Moon, text: "Get 7-8 hours of sleep", color: "text-purple-500" },
  { icon: Apple, text: "Eat 5 servings of fruits & vegetables", color: "text-green-500" },
];

const HealthTips = () => {
  const randomTip = tips[Math.floor(Math.random() * tips.length)];
  const Icon = randomTip.icon;

  return (
    <Card className="shadow-medium border-l-4 border-l-secondary">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="p-2 bg-secondary/10 rounded-lg">
            <Lightbulb className="w-5 h-5 text-secondary" />
          </div>
          <div>
            <CardTitle className="text-lg">Daily Health Tip</CardTitle>
            <CardDescription>Small steps to better health</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-lg">
          <Icon className={`w-6 h-6 ${randomTip.color}`} />
          <p className="text-sm font-medium">{randomTip.text}</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default HealthTips;
