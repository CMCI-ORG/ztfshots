import { Facebook, Twitter, Instagram, Globe, Mail } from "lucide-react";
import { SocialLink } from "./types";

interface FooterSocialProps {
  socialLinks: SocialLink[];
  contactEmail?: string | null;
}

export const FooterSocial = ({ socialLinks, contactEmail }: FooterSocialProps) => {
  return (
    <div className="space-y-4">
      {contactEmail && (
        <div className="flex items-center space-x-2 text-muted-foreground">
          <Mail className="h-5 w-5" />
          <a href={`mailto:${contactEmail}`} className="hover:text-[#8B5CF6]">
            {contactEmail}
          </a>
        </div>
      )}
      <div className="flex space-x-4">
        {socialLinks.map((social) => {
          const Icon = {
            Twitter: Twitter,
            Facebook: Facebook,
            Instagram: Instagram,
            Website: Globe,
          }[social.platform] || Globe;

          return (
            <a
              key={social.platform}
              href={social.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-[#8B5CF6]"
            >
              <Icon className="h-5 w-5" />
            </a>
          );
        })}
      </div>
    </div>
  );
};