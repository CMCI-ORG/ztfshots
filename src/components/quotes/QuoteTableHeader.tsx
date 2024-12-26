import { TableHead, TableHeader, TableRow } from "@/components/ui/table";

export function QuoteTableHeader() {
  return (
    <TableHeader>
      <TableRow>
        <TableHead className="w-[40%]">Quote</TableHead>
        <TableHead className="w-[15%]">Author</TableHead>
        <TableHead className="w-[15%]">Category</TableHead>
        <TableHead className="w-[15%]">Source</TableHead>
        <TableHead className="w-[8%]">Status</TableHead>
        <TableHead className="w-[7%] text-right">Actions</TableHead>
      </TableRow>
    </TableHeader>
  );
}