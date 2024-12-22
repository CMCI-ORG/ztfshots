import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Image, Loader2 } from "lucide-react";

interface ImageUploadProps {
  value?: string | null;
  onChange: (url: string) => void;
  bucket: string;
  path: string;
}

export function ImageUpload({ value, onChange, bucket, path }: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      const fileExt = file.name.split('.').pop();
      const filePath = `${path}/${Math.random()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(filePath, file, {
          upsert: true
        });

      if (uploadError) {
        console.error('Error uploading:', uploadError);
        throw uploadError;
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
      console.error('Error uploading image:', error);
      toast({
        title: "Error",
        description: "Failed to upload image. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-4">
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
          accept="image/*"
          className="hidden"
          onChange={handleUpload}
          disabled={isUploading}
        />
        <Input
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Or enter image URL..."
          disabled={isUploading}
        />
      </div>
      {value && (
        <div className="relative w-40 h-40 rounded-lg overflow-hidden border">
          <img
            src={value}
            alt="Preview"
            className="w-full h-full object-cover"
          />
        </div>
      )}
    </div>
  );
}