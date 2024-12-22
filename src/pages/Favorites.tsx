import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/providers/AuthProvider";

const Favorites = () => {
  const { user } = useAuth();

  const { data: favoriteQuotes, isLoading } = useQuery({
    queryKey: ['favorite-quotes', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      
      const { data, error } = await supabase
        .from('quote_stars')
        .select(`
          quotes (
            id,
            text,
            author: authors (
              name
            )
          )
        `)
        .eq('user_id', user.id);

      if (error) throw error;
      return data;
    },
    enabled: !!user?.id,
  });

  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>Favorite Quotes</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p>Loading favorites...</p>
          ) : favoriteQuotes?.length === 0 ? (
            <p>No favorite quotes yet.</p>
          ) : (
            <div className="space-y-4">
              {favoriteQuotes?.map((favorite) => (
                <div key={favorite.quotes?.id} className="p-4 border rounded-lg">
                  <p className="text-lg">{favorite.quotes?.text}</p>
                  <p className="text-sm text-muted-foreground mt-2">
                    - {favorite.quotes?.author?.name}
                  </p>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Favorites;