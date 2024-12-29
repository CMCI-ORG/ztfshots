import { FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

interface SourceFieldsProps {
  langName: string;
  sourceTitle: string;
  sourceUrl: string;
  onSourceTitleChange: (value: string) => void;
  onSourceUrlChange: (value: string) => void;
}

export function SourceFields({
  langName,
  sourceTitle,
  sourceUrl,
  onSourceTitleChange,
  onSourceUrlChange,
}: SourceFieldsProps) {
  return (
    <div className="space-y-4">
      <FormItem>
        <FormLabel>Source Title</FormLabel>
        <FormControl>
          <Input
            placeholder={`Enter source title in ${langName}`}
            value={sourceTitle}
            onChange={(e) => onSourceTitleChange(e.target.value)}
          />
        </FormControl>
      </FormItem>
      <FormItem>
        <FormLabel>Source URL</FormLabel>
        <FormControl>
          <Input
            type="url"
            placeholder={`Enter source URL in ${langName}`}
            value={sourceUrl}
            onChange={(e) => onSourceUrlChange(e.target.value)}
          />
        </FormControl>
      </FormItem>
    </div>
  );
}