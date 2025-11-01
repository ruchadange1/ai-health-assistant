import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, Lock, Eye } from "lucide-react";

interface PrivacyConsentProps {
  onAccept: () => void;
}

const PrivacyConsent = ({ onAccept }: PrivacyConsentProps) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-secondary/5 p-4">
      <Card className="max-w-2xl shadow-elevated">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="p-4 bg-gradient-primary rounded-2xl">
              <Shield className="w-12 h-12 text-primary-foreground" />
            </div>
          </div>
          <CardTitle className="text-3xl">Privacy & Data Consent</CardTitle>
          <CardDescription className="text-base">
            Your privacy and security are our top priorities
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-start gap-4 p-4 bg-muted/50 rounded-lg">
              <Lock className="w-6 h-6 text-primary mt-1" />
              <div>
                <h3 className="font-semibold mb-1">Secure Storage</h3>
                <p className="text-sm text-muted-foreground">
                  Your health data is encrypted and stored securely in our HIPAA-compliant database.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 bg-muted/50 rounded-lg">
              <Eye className="w-6 h-6 text-primary mt-1" />
              <div>
                <h3 className="font-semibold mb-1">Local Analysis</h3>
                <p className="text-sm text-muted-foreground">
                  Camera and voice data is analyzed locally on your device when possible for maximum privacy.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 bg-muted/50 rounded-lg">
              <Shield className="w-6 h-6 text-primary mt-1" />
              <div>
                <h3 className="font-semibold mb-1">Your Control</h3>
                <p className="text-sm text-muted-foreground">
                  You can delete your data at any time. We never share your personal health information without consent.
                </p>
              </div>
            </div>
          </div>

          <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg">
            <h4 className="font-semibold mb-2">What we'll access:</h4>
            <ul className="space-y-1 text-sm">
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-primary rounded-full"></span>
                Camera for facial analysis
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-primary rounded-full"></span>
                Microphone for voice recording
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-primary rounded-full"></span>
                Your survey responses
              </li>
            </ul>
          </div>

          <div className="space-y-3">
            <Button onClick={onAccept} className="w-full gradient-primary" size="lg">
              I Understand & Accept
            </Button>
            <p className="text-xs text-center text-muted-foreground">
              By continuing, you agree to our privacy policy and consent to data processing for health analysis.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PrivacyConsent;
