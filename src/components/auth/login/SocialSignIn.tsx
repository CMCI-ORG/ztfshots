import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { Provider } from "@supabase/supabase-js";

interface SocialSignInProps {
  provider: Provider;
  children: React.ReactNode;
  icon: React.ReactNode;
}

export const SocialSignIn = ({ provider, children, icon }: SocialSignInProps) => {
  return (
    <Button 
      variant="outline" 
      className="w-full py-6 flex items-center justify-center gap-3 border-2 hover:bg-muted/50 relative"
      onClick={() => {
        supabase.auth.signInWithOAuth({
          provider,
          options: {
            redirectTo: `${window.location.origin}/profile`
          }
        });
      }}
    >
      {icon}
      {children}
    </Button>
  );
};