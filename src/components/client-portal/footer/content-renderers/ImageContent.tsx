import { useToast } from "@/components/ui/use-toast";

interface ImageContentProps {
  url: string;
  alt?: string;
  title?: string;
}

export function ImageContent({ url, alt, title }: ImageContentProps) {
  const { toast } = useToast();

  return (
    <div className="space-y-4">
      {title && (
        <h4 className="font-bold text-base text-foreground">{title}</h4>
      )}
      <img 
        src={url} 
        alt={alt || title || ''} 
        className="max-w-full h-auto rounded-lg"
        onError={(e) => {
          console.error('Failed to load image:', url);
          e.currentTarget.style.display = 'none';
          toast({
            variant: "destructive",
            title: "Error loading image",
            description: "Failed to load image. Please check the URL and try again."
          });
        }}
      />
    </div>
  );
}