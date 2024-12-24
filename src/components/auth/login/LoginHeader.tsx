interface LoginHeaderProps {
  logoUrl?: string;
  siteName?: string;
}

export const LoginHeader = ({ logoUrl, siteName }: LoginHeaderProps) => {
  return (
    <>
      {logoUrl ? (
        <div className="flex justify-center">
          <img 
            src={logoUrl} 
            alt={siteName || "Site Logo"} 
            className="h-12 w-auto"
          />
        </div>
      ) : (
        <h1 className="text-4xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-indigo-600">
          {siteName || "Welcome Back"}
        </h1>
      )}

      <div className="text-center space-y-2">
        <h2 className="text-2xl font-semibold text-gray-900">
          Sign in to your account
        </h2>
        <p className="text-muted-foreground">
          Access your personalized dashboard and manage your content
        </p>
      </div>
    </>
  );
};