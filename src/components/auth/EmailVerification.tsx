import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useEmailVerification } from "@/hooks/auth/useEmailVerification";
import { useAuth } from "@/providers/AuthProvider";
import { Mail } from "lucide-react";

export const EmailVerification = () => {
  const { user } = useAuth();
  const { loading, sendVerificationEmail } = useEmailVerification();

  const handleResendVerification = async () => {
    if (user?.email) {
      await sendVerificationEmail(user.email);
    }
  };

  if (!user || user.email_confirmed_at) return null;

  return (
    <Card className="mb-6 border-yellow-200 bg-yellow-50">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <Mail className="h-4 w-4" />
          Email Verification Required
        </CardTitle>
        <CardDescription className="text-xs text-yellow-700">
          Please verify your email address to access all features
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Button
          variant="outline"
          size="sm"
          onClick={handleResendVerification}
          disabled={loading}
        >
          {loading ? "Sending..." : "Resend Verification Email"}
        </Button>
      </CardContent>
    </Card>
  );
};