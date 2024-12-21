import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

interface Comment {
  id: number;
  author: string;
  content: string;
  date: string;
}

export const CommentSection = () => {
  const [comment, setComment] = useState("");
  const { toast } = useToast();
  const [comments, setComments] = useState<Comment[]>([
    {
      id: 1,
      author: "John Doe",
      content: "This quote really spoke to my heart. It reminded me to trust in God's timing.",
      date: "2024-02-20",
    },
  ]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newComment: Comment = {
      id: comments.length + 1,
      author: "Guest User",
      content: comment,
      date: new Date().toISOString().split("T")[0],
    };
    setComments([newComment, ...comments]);
    setComment("");
    toast({
      title: "Comment posted!",
      description: "Thank you for sharing your thoughts.",
    });
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">Share Your Thoughts</h3>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <Textarea
          placeholder="How did this quote inspire you?"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          required
        />
        <Button type="submit">Post Comment</Button>
      </form>

      <div className="space-y-4">
        {comments.map((comment) => (
          <div key={comment.id} className="border rounded-lg p-4">
            <div className="flex justify-between items-center mb-2">
              <span className="font-medium">{comment.author}</span>
              <span className="text-sm text-muted-foreground">{comment.date}</span>
            </div>
            <p className="text-muted-foreground">{comment.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
};