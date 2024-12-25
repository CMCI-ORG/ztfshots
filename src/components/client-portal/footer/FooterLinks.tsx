import { Link } from "react-router-dom";
import { FooterLink } from "./types";

interface FooterLinksProps {
  links: FooterLink[];
}

export const FooterLinks = ({ links }: FooterLinksProps) => {
  const defaultLinks = [
    { title: "Releases", url: "/releases" },
    { title: "Roadmap", url: "/roadmap" },
  ];

  // Helper function to ensure correct URL format
  const getFormattedUrl = (url: string) => {
    // If it's an external URL (starts with http:// or https://)
    if (url.startsWith('http')) {
      return url;
    }
    // If it's a category URL that doesn't start with /
    if (url.startsWith('categories/')) {
      return `/${url}`;
    }
    // For all other internal URLs
    return url.startsWith('/') ? url : `/${url}`;
  };

  return (
    <nav className="flex flex-col space-y-2">
      {[...links, ...defaultLinks].map((link: FooterLink) => (
        <Link 
          key={link.url}
          to={getFormattedUrl(link.url)} 
          className="text-sm text-muted-foreground hover:text-[#8B5CF6]"
        >
          {link.title}
        </Link>
      ))}
    </nav>
  );
};