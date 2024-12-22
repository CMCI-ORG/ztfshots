import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Image, Loader2, AlertTriangle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";

interface ImageUploadProps {
  value?: string | null;
  onChange: (url: string) => void;
  bucket: string;
  path: string;
}

export function ImageUpload({ value, onChange, bucket, path }: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const validateFile = (file: File) => {
    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      throw new Error("File size must be less than 5MB");
    }

    // Validate file type
    if (!file.type.startsWith("image/")) {
      throw new Error("Only image files are allowed");
    }

    // Additional validation for specific image types if needed
    const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      throw new Error("Only JPEG, PNG, GIF, and WebP images are allowed");
    }
  };

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      setError(null);

      // Validate file
      validateFile(file);

      const fileExt = file.name.split(".").pop();
      const filePath = `${path}/${Math.random()}.${fileExt}`;

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(filePath, file, {
          cacheControl: "3600",
          upsert: false
        });

      if (uploadError) {
        console.error("Error uploading:", uploadError);
        throw new Error(uploadError.message);
      }

      const { data: { publicUrl } } = supabase.storage
        .from(bucket)
        .getPublicUrl(filePath);

      onChange(publicUrl);
      
      toast({
        title: "Success",
        description: "Image uploaded successfully",
      });
    } catch (error) {
      console.error("Error uploading image:", error);
      setError(error instanceof Error ? error.message : "Failed to upload image");
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to upload image",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
      if (event.target) {
        event.target.value = '';  // Reset input
      }
    }
  };

  const handleImageError = () => {
    setError("Failed to load image preview");
    setIsLoading(false);
  };

  return (
    <div className="space-y-4">
      {error && (
        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4" />
            {error}
          </AlertDescription>
        </Alert>
      )}
      <div className="flex items-center gap-4">
        <Button
          type="button"
          variant="outline"
          className="w-[120px]"
          disabled={isUploading}
          onClick={() => document.getElementById(`${path}-upload`)?.click()}
        >
          {isUploading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Image className="h-4 w-4 mr-2" />
          )}
          Upload
        </Button>
        <Input
          id={`${path}-upload`}
          type="file"
          accept="image/jpeg,image/png,image/gif,image/webp"
          className="hidden"
          onChange={handleUpload}
          disabled={isUploading}
        />
        <Input
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Or enter image URL..."
          disabled={isUploading}
        />
      </div>
      {value && (
        <div className="relative w-40 h-40 rounded-lg overflow-hidden border">
          {isLoading && <Skeleton className="w-full h-full" />}
          <img
            src={value}
            alt="Preview"
            className="w-full h-full object-cover"
            loading="lazy"
            onLoad={() => setIsLoading(false)}
            onError={handleImageError}
            style={{ display: isLoading ? 'none' : 'block' }}
          />
        </div>
      )}
    </div>
  );
}