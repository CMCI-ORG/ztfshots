import { useState, useEffect } from 'react';
import { useUser } from '@supabase/auth-helpers-react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';

interface Profile {
  username: string | null;
  avatar_url: string | null;
}

interface Comment {
  id: string;
  content: string;
  created_at: string;
  user_id: string;
  profiles: Profile | null;
}

interface CommentSectionProps {
  quoteId: string;
}

// Type guard for Profile
function isProfile(value: any): value is Profile {
  return value && 
    typeof value === 'object' && 
    ('username' in value || value.username === null) && 
    ('avatar_url' in value || value.avatar_url === null);
}

export function CommentSection({ quoteId }: CommentSectionProps) {
  const user = useUser();
  const { toast } = useToast();
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const fetchComments = async () => {
    try {
      const { data, error } = await supabase
        .from('comments')
        .select(`
          id,
          content,
          created_at,
          user_id,
          profiles:user_id (
            username,
            avatar_url
          )
        `)
        .eq('quote_id', quoteId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      if (data) {
        const transformedComments = data.map(comment => {
          // Validate profile data using type guard
          const profileData = comment.profiles && isProfile(comment.profiles) 
            ? comment.profiles 
            : null;

          return {
            id: comment.id,
            content: comment.content,
            created_at: comment.created_at,
            user_id: comment.user_id,
            profiles: profileData
          };
        });
        
        setComments(transformedComments);
      }
    } catch (error) {
      console.error('Error fetching comments:', error);
      toast({
        title: "Error",
        description: "Failed to load comments",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchComments();
  }, [quoteId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to comment on quotes",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsLoading(true);
      const { error } = await supabase
        .from('comments')
        .insert({
          quote_id: quoteId,
          user_id: user.id,
          content: newComment,
        });

      if (error) throw error;

      setNewComment('');
      toast({
        title: "Success",
        description: "Comment posted successfully!",
      });
      fetchComments();
    } catch (error) {
      console.error('Error posting comment:', error);
      toast({
        title: "Error",
        description: "Failed to post comment",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder={user ? "Write a comment..." : "Sign in to comment"}
          disabled={!user || isLoading}
        />
        <Button 
          type="submit"
          disabled={!user || !newComment.trim() || isLoading}
        >
          Post Comment
        </Button>
      </form>

      <div className="space-y-4">
        {comments.map((comment) => (
          <div key={comment.id} className="p-4 border rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <span className="font-semibold">
                {comment.profiles?.username || 'Anonymous'}
              </span>
              <span className="text-sm text-gray-500">
                {new Date(comment.created_at).toLocaleDateString()}
              </span>
            </div>
            <p>{comment.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
}