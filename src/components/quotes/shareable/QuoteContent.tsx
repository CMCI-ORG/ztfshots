interface QuoteContentProps {
  quote: string;
  author: string;
  sourceTitle?: string;
  textColor: string;
}

export const QuoteContent = ({ quote, author, sourceTitle, textColor }: QuoteContentProps) => {
  return (
    <div className="flex-1 flex flex-col items-center justify-center">
      <div className="relative mb-4">
        <span className="absolute -top-6 -left-4 text-6xl text-[#33A1DE] opacity-20 font-serif leading-none">"</span>
        <blockquote 
          className="text-base md:text-xl lg:text-2xl font-serif italic"
          style={{ color: textColor }}
        >
          {quote}
        </blockquote>
        <span className="absolute -bottom-4 right-0 text-4xl text-[#33A1DE] opacity-20 font-serif leading-none rotate-180">"</span>
      </div>
      <div className="space-y-2">
        {sourceTitle && (
          <p 
            className="text-xs italic"
            style={{ color: textColor }}
          >
            From: {sourceTitle}
          </p>
        )}
        <footer 
          className="text-sm md:text-base font-medium"
          style={{ color: textColor }}
        >
          — {author}
        </footer>
      </div>
    </div>
  );
};