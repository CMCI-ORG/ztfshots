import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useEmailVerification } from "@/hooks/auth/useEmailVerification";
import { CheckCircle2, Loader2 } from "lucide-react";

const EmailVerificationSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { verifyEmail } = useEmailVerification();
  const token = searchParams.get("token");

  useEffect(() => {
    const handleVerification = async () => {
      if (token) {
        const success = await verifyEmail(token);
        if (success) {
          setTimeout(() => {
            navigate("/admin");
          }, 3000);
        }
      }
    };

    handleVerification();
  }, [token, navigate, verifyEmail]);

  if (!token) {
    return (
      <Card className="max-w-md mx-auto mt-20">
        <CardHeader className="pb-3">
          <CardTitle>Invalid Verification Link</CardTitle>
          <CardDescription>
            The verification link appears to be invalid or has expired.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card className="max-w-md mx-auto mt-20">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2">
          <CheckCircle2 className="h-5 w-5 text-green-500" />
          Email Verification
        </CardTitle>
        <CardDescription>
          We're verifying your email address...
        </CardDescription>
      </CardHeader>
      <CardContent className="flex justify-center">
        <Loader2 className="h-6 w-6 animate-spin" />
      </CardContent>
    </Card>
  );
};

export default EmailVerificationSuccess;