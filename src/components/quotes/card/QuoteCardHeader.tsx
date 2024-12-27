import { Link } from "react-router-dom";

interface QuoteCardHeaderProps {
  category: string;
  categoryId?: string;
}

export const QuoteCardHeader = ({
  category,
  categoryId,
}: QuoteCardHeaderProps) => {
  return (
    <div className="flex justify-center">
      <Link
        to={categoryId ? `/categories/${categoryId}` : '#'}
        className="text-sm text-[#5A7BA6] hover:text-[#33A1DE] transition-colors"
      >
        {category}
      </Link>
    </div>
  );
};