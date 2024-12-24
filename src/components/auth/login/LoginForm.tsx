import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";

export const LoginForm = () => {
  return (
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
  );
};