import { Link } from "react-router-dom";
import { FooterLink } from "./types";

interface FooterLinksProps {
  links: FooterLink[];
}

export const FooterLinks = ({ links }: FooterLinksProps) => {
  return (
    <nav className="flex flex-col space-y-2">
      {links.map((link: FooterLink) => (
        <Link 
          key={link.url}
          to={link.url} 
          className="text-sm text-muted-foreground hover:text-[#8B5CF6]"
        >
          {link.title}
        </Link>
      ))}
    </nav>
  );
};