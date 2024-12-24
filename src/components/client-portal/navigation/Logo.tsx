import { Link } from "react-router-dom";

interface LogoProps {
  logoUrl?: string;
  siteName?: string;
}

export const Logo = ({ logoUrl, siteName }: LogoProps) => {
  return logoUrl ? (
    <Link to="/" className="flex-shrink-0">
      <img 
        src={logoUrl} 
        alt={siteName || "Site Logo"} 
        className="h-8 sm:h-12 w-auto"
      />
    </Link>
  ) : (
    <Link to="/" className="flex-shrink-0">
      <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-[#8B5CF6] font-['Open_Sans']">
        {siteName || "#ZTFBooks"}
      </h1>
    </Link>
  );
};