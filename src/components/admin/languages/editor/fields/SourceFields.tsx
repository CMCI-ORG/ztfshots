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
      <div className="space-y-2">
        <label className="text-sm font-medium">Source Title</label>
        <Input
          placeholder={`Enter source title in ${langName}`}
          value={sourceTitle}
          onChange={(e) => onSourceTitleChange(e.target.value)}
        />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium">Source URL</label>
        <Input
          type="url"
          placeholder={`Enter source URL in ${langName}`}
          value={sourceUrl}
          onChange={(e) => onSourceUrlChange(e.target.value)}
        />
      </div>
    </div>
  );
}