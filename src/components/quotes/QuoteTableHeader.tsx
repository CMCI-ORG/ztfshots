import { TableHead, TableHeader, TableRow } from "@/components/ui/table";

export function QuoteTableHeader() {
  return (
    <TableHeader>
      <TableRow>
        <TableHead>Quote</TableHead>
        <TableHead>Author</TableHead>
        <TableHead>Category</TableHead>
        <TableHead>Source</TableHead>
        <TableHead>Status</TableHead>
        <TableHead>Actions</TableHead>
      </TableRow>
    </TableHeader>
  );
}