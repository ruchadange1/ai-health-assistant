import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageCircle, X, Send } from "lucide-react";

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Array<{ role: "user" | "bot"; text: string }>>([
    { role: "bot", text: "Hi! I'm your health assistant. How can I help you today?" }
  ]);
  const [input, setInput] = useState("");

  const predefinedResponses: Record<string, string> = {
    "sleep": "Aim for 7-8 hours of quality sleep each night. Maintain a consistent sleep schedule and create a relaxing bedtime routine.",
    "dark circles": "Dark circles can form due to lack of sleep, dehydration, or genetics. Try getting more rest, staying hydrated, and using a cold compress.",
    "dehydration": "Dehydration occurs when you don't drink enough water. Aim for 8-10 glasses daily and increase intake during exercise.",
    "stress": "Manage stress through regular exercise, meditation, deep breathing, and maintaining a healthy work-life balance.",
    "diet": "A balanced diet includes fruits, vegetables, whole grains, lean proteins, and healthy fats. Limit processed foods and sugar.",
    "exercise": "Aim for at least 150 minutes of moderate exercise per week. Include cardio, strength training, and flexibility exercises.",
  };

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage = { role: "user" as const, text: input };
    setMessages(prev => [...prev, userMessage]);

    const lowerInput = input.toLowerCase();
    let botResponse = "I can help with questions about sleep, dark circles, dehydration, stress, diet, and exercise. What would you like to know?";

    for (const [key, value] of Object.entries(predefinedResponses)) {
      if (lowerInput.includes(key)) {
        botResponse = value;
        break;
      }
    }

    setTimeout(() => {
      setMessages(prev => [...prev, { role: "bot", text: botResponse }]);
    }, 500);

    setInput("");
  };

  if (!isOpen) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 rounded-full w-14 h-14 shadow-elevated gradient-primary hover:scale-110 transition-smooth"
      >
        <MessageCircle className="w-6 h-6" />
      </Button>
    );
  }

  return (
    <Card className="fixed bottom-6 right-6 w-96 shadow-elevated">
      <CardHeader className="flex flex-row items-center justify-between p-4 bg-gradient-primary rounded-t-xl">
        <CardTitle className="text-lg text-primary-foreground">Health Assistant</CardTitle>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsOpen(false)}
          className="hover:bg-white/20 text-primary-foreground"
        >
          <X className="w-4 h-4" />
        </Button>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-96 p-4">
          <div className="space-y-4">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[80%] p-3 rounded-lg ${
                    msg.role === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted"
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
        <div className="p-4 border-t flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSend()}
            placeholder="Ask a question..."
          />
          <Button onClick={handleSend} size="icon" className="gradient-primary">
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ChatBot;
