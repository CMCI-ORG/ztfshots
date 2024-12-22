import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/providers/AuthProvider";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

interface Comment {
  id: string;
  content: string;
  user_id: string;
  created_at: string;
  profiles?: {
    username?: string;
    avatar_url?: string;
  };
}

interface CommentSectionProps {
  quoteId: string;
}

export const CommentSection = ({ quoteId }: CommentSectionProps) => {
  const [comment, setComment] = useState("");
  const { toast } = useToast();
  const { user } = useAuth();
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchComments();
  }, [quoteId]);

  const fetchComments = async () => {
    try {
      const { data, error } = await supabase
        .from('comments')
        .select(`
          *,
          profiles:user_id (
            username,
            avatar_url
          )
        `)
        .eq('quote_id', quoteId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setComments(data as Comment[] || []);
    } catch (error) {
      console.error('Error fetching comments:', error);
      toast({
        title: "Error",
        description: "Failed to load comments",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      const { error } = await supabase
        .from('comments')
        .insert({
          quote_id: quoteId,
          user_id: user.id,
          content: comment,
        });

      if (error) throw error;

      setComment("");
      toast({
        title: "Success",
        description: "Comment posted successfully!",
      });
      fetchComments(); // Refresh comments
    } catch (error) {
      console.error('Error posting comment:', error);
      toast({
        title: "Error",
        description: "Failed to post comment",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return <div className="animate-pulse">Loading comments...</div>;
  }

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">Share Your Thoughts</h3>
      
      {user ? (
        <form onSubmit={handleSubmit} className="space-y-4">
          <Textarea
            placeholder="How did this quote inspire you?"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            required
          />
          <Button type="submit">Post Comment</Button>
        </form>
      ) : (
        <div className="bg-muted/50 rounded-lg p-4 text-center space-y-3">
          <p className="text-muted-foreground">
            Please sign in to share your thoughts on this quote.
          </p>
          <Button asChild variant="outline">
            <Link to="/login">Sign In</Link>
          </Button>
        </div>
      )}

      <div className="space-y-4">
        {comments.map((comment) => (
          <div key={comment.id} className="border rounded-lg p-4">
            <div className="flex justify-between items-center mb-2">
              <span className="font-medium">
                {comment.profiles?.username || "Anonymous User"}
              </span>
              <span className="text-sm text-muted-foreground">
                {new Date(comment.created_at).toLocaleDateString()}
              </span>
            </div>
            <p className="text-muted-foreground">{comment.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
};