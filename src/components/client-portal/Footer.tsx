import { Facebook, Twitter, Instagram, Globe } from "lucide-react";
import { Link } from "react-router-dom";

export const Footer = () => {
  return (
    <footer className="bg-white/80 backdrop-blur-sm border-t">
      <div className="container mx-auto py-8 px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-[#8B5CF6]">#ZTFBooks</h3>
            <p className="text-sm text-muted-foreground">
              Daily inspiration for your spiritual journey
            </p>
          </div>
          
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Quick Links</h3>
            <nav className="flex flex-col space-y-2">
              <Link to="/privacy" className="text-sm text-muted-foreground hover:text-[#8B5CF6]">
                Privacy Policy
              </Link>
              <Link to="/terms" className="text-sm text-muted-foreground hover:text-[#8B5CF6]">
                Terms of Use
              </Link>
              <Link to="/contact" className="text-sm text-muted-foreground hover:text-[#8B5CF6]">
                Contact Us
              </Link>
            </nav>
          </div>
          
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Follow Us</h3>
            <div className="flex space-x-4">
              <a
                href="https://twitter.com/ZTFBooks"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-[#8B5CF6]"
              >
                <Twitter className="h-5 w-5" />
              </a>
              <a
                href="https://facebook.com/ZTFBooks"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-[#8B5CF6]"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a
                href="https://instagram.com/ZTFBooks"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-[#8B5CF6]"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href="https://ztfbooks.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-[#8B5CF6]"
              >
                <Globe className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>
        
        <div className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} ZTF Books. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};