import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";
import { GoogleSignIn } from "./GoogleSignIn";

export const LoginForm = () => {
  return (
    <div className="space-y-6">
      <GoogleSignIn />

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            Or continue with email
          </span>
        </div>
      </div>

      <Auth
        supabaseClient={supabase}
        appearance={{
          theme: ThemeSupa,
          style: {
            button: {
              background: 'hsl(var(--primary))',
              color: 'hsl(var(--primary-foreground))',
              borderRadius: 'var(--radius)',
            },
            anchor: {
              color: 'hsl(var(--primary))',
              textDecoration: 'none',
            },
            container: {
              color: 'hsl(var(--foreground))',
            },
            label: {
              color: 'hsl(var(--foreground))',
            },
            input: {
              backgroundColor: 'transparent',
              borderColor: 'hsl(var(--border))',
              color: 'hsl(var(--foreground))',
            },
          },
          className: {
            container: 'space-y-4',
            button: 'w-full',
            input: 'bg-background',
          },
        }}
        theme="default"
        providers={[]}
      />
    </div>
  );
};