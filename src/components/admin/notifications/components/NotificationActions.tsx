import { Button } from "@/components/ui/button";

interface NotificationActionsProps {
  onSelectAll: () => void;
  onClearSelection: () => void;
  onSendDigest: () => void;
  isLoading: boolean;
  selectedCount: number;
}

export const NotificationActions = ({
  onSelectAll,
  onClearSelection,
  onSendDigest,
  isLoading,
  selectedCount
}: NotificationActionsProps) => {
  return (
    <div className="flex flex-wrap gap-2">
      <Button 
        variant="outline" 
        onClick={onSelectAll}
        disabled={isLoading}
        className="min-w-[100px]"
      >
        Select All
      </Button>
      <Button 
        variant="outline" 
        onClick={onClearSelection}
        disabled={isLoading}
        className="min-w-[100px]"
      >
        Clear
      </Button>
      <Button 
        onClick={onSendDigest}
        disabled={isLoading || selectedCount === 0}
        className="min-w-[100px]"
      >
        {isLoading ? "Sending..." : "Send Digest"}
      </Button>
    </div>
  );
};