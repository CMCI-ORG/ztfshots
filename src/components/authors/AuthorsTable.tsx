import { useState } from "react";
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
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { EditAuthorForm } from "./EditAuthorForm";
import { Skeleton } from "@/components/ui/skeleton";

export function AuthorsTable() {
  const { toast } = useToast();
  const [editingAuthor, setEditingAuthor] = useState(null);
  const [authorToDelete, setAuthorToDelete] = useState(null);
  const [loadingAvatars, setLoadingAvatars] = useState<Record<string, boolean>>({});

  const { data: authors, refetch } = useQuery({
    queryKey: ["authors"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("authors")
        .select("*")
        .order("name");
      if (error) throw error;
      return data;
    },
  });

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("authors").delete().eq("id", id);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to delete author",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description: "Author deleted successfully",
      });
      refetch();
    }
    setAuthorToDelete(null);
  };

  const handleImageLoad = (authorId: string) => {
    setLoadingAvatars(prev => ({
      ...prev,
      [authorId]: false
    }));
  };

  return (
    <div className="rounded-md border overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[50px]">Image</TableHead>
            <TableHead>Name</TableHead>
            <TableHead className="hidden sm:table-cell">Bio</TableHead>
            <TableHead className="w-[100px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {authors?.map((author) => (
            <TableRow key={author.id}>
              <TableCell>
                <Avatar className="h-8 w-8 sm:h-10 sm:w-10">
                  {loadingAvatars[author.id] !== false && 
                    <Skeleton className="h-full w-full rounded-full" />
                  }
                  <AvatarImage 
                    src={author.image_url} 
                    alt={author.name}
                    loading="lazy"
                    onLoad={() => handleImageLoad(author.id)}
                    style={{ display: loadingAvatars[author.id] !== false ? 'none' : 'block' }}
                  />
                  <AvatarFallback>{author.name[0]}</AvatarFallback>
                </Avatar>
              </TableCell>
              <TableCell className="font-medium">{author.name}</TableCell>
              <TableCell className="hidden sm:table-cell max-w-md truncate">
                {author.bio}
              </TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setEditingAuthor(author)}
                    className="h-8 w-8"
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setAuthorToDelete(author)}
                    className="h-8 w-8"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Dialog open={editingAuthor !== null} onOpenChange={() => setEditingAuthor(null)}>
        <DialogContent className="sm:max-w-[600px] w-[95vw] sm:w-full">
          <DialogHeader>
            <DialogTitle>Edit Author</DialogTitle>
          </DialogHeader>
          {editingAuthor && (
            <EditAuthorForm
              author={editingAuthor}
              onSuccess={() => setEditingAuthor(null)}
            />
          )}
        </DialogContent>
      </Dialog>

      <AlertDialog open={authorToDelete !== null} onOpenChange={() => setAuthorToDelete(null)}>
        <AlertDialogContent className="w-[95vw] sm:w-full max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the author
              {authorToDelete?.name ? ` "${authorToDelete.name}"` : ''} and remove their data
              from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => authorToDelete && handleDelete(authorToDelete.id)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}