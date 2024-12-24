import { Link } from "react-router-dom";
import { Apple, Globe } from "lucide-react";

interface FooterLogoProps {
  logoUrl?: string | null;
  siteName?: string;
  tagLine?: string;
  playstoreLink?: string | null;
}

export const FooterLogo = ({ logoUrl, siteName, tagLine, playstoreLink }: FooterLogoProps) => {
  return (
    <div className="space-y-4">
      {logoUrl ? (
        <img 
          src={logoUrl} 
          alt={siteName || "ZTFBooks"} 
          className="h-8 w-auto"
        />
      ) : (
        <h3 className="text-lg font-semibold text-[#8B5CF6]">
          {siteName || "#ZTFBooks"}
        </h3>
      )}
      <p className="text-sm text-muted-foreground">
        {tagLine || "Daily inspiration for your spiritual journey"}
      </p>
      <div className="flex space-x-4">
        <a
          href={playstoreLink || "#"}
          target="_blank"
          rel="noopener noreferrer"
          className="text-muted-foreground hover:text-[#8B5CF6]"
        >
          <Apple className="h-6 w-6" />
        </a>
        <a
          href="#"
          target="_blank"
          rel="noopener noreferrer"
          className="text-muted-foreground hover:text-[#8B5CF6]"
        >
          <Globe className="h-6 w-6" />
        </a>
      </div>
    </div>
  );
};