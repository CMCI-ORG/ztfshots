import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { FeedSettings } from "./types";

interface FeedSettingsTableProps {
  feeds: FeedSettings[] | null;
  onEdit: (feed: FeedSettings) => void;
  onDelete: (id: string) => void;
}

export function FeedSettingsTable({ feeds, onEdit, onDelete }: FeedSettingsTableProps) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Section Title</TableHead>
            <TableHead>RSS URL</TableHead>
            <TableHead>Footer Position</TableHead>
            <TableHead>Order</TableHead>
            <TableHead>Items</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {feeds?.map((feed) => (
            <TableRow key={feed.id}>
              <TableCell>{feed.section_title}</TableCell>
              <TableCell className="max-w-[200px] truncate">
                {feed.rss_url}
              </TableCell>
              <TableCell>
                <Badge variant="outline" className="capitalize">
                  {feed.footer_position.replace('_', ' ')}
                </Badge>
              </TableCell>
              <TableCell>{feed.footer_order}</TableCell>
              <TableCell>{feed.feed_count}</TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onEdit(feed)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onDelete(feed.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
          {(!feeds || feeds.length === 0) && (
            <TableRow>
              <TableCell colSpan={6} className="text-center">
                No feeds found. Click the "Add New Feed" button to create one.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}