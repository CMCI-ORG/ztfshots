import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";

export function SubscribersTable() {
  const { data: subscribers, error, isLoading } = useQuery({
    queryKey: ["subscribers"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("subscribers")
        .select("*")
        .order("created_at", { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });

  if (error) {
    console.error("Error fetching subscribers:", error);
    return (
      <div className="p-4 text-red-500">
        Error loading subscribers. Please try again later.
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Subscribed On</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {[1, 2, 3].map((i) => (
              <TableRow key={i}>
                <TableCell><Skeleton className="h-4 w-[200px]" /></TableCell>
                <TableCell><Skeleton className="h-4 w-[250px]" /></TableCell>
                <TableCell><Skeleton className="h-4 w-[150px]" /></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Subscribed On</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {subscribers?.map((subscriber) => (
            <TableRow key={subscriber.id}>
              <TableCell>{subscriber.name}</TableCell>
              <TableCell>{subscriber.email}</TableCell>
              <TableCell>
                {format(new Date(subscriber.created_at), "PPP")}
              </TableCell>
            </TableRow>
          ))}
          {subscribers?.length === 0 && (
            <TableRow>
              <TableCell colSpan={3} className="text-center py-4">
                No subscribers yet
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}