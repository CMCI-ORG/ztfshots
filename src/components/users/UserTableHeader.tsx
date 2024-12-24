import { TableHead, TableHeader, TableRow } from "@/components/ui/table";

export const UserTableHeader = () => (
  <TableHeader>
    <TableRow>
      <TableHead>Email</TableHead>
      <TableHead>Username</TableHead>
      <TableHead>Role</TableHead>
      <TableHead>Actions</TableHead>
    </TableRow>
  </TableHeader>
);