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
    <div className="space-x-2">
      <Button 
        variant="outline" 
        onClick={onSelectAll}
        disabled={isLoading}
      >
        Select All
      </Button>
      <Button 
        variant="outline" 
        onClick={onClearSelection}
        disabled={isLoading}
      >
        Clear Selection
      </Button>
      <Button 
        onClick={onSendDigest}
        disabled={isLoading || selectedCount === 0}
      >
        {isLoading ? "Sending..." : "Send Digest"}
      </Button>
    </div>
  );
};