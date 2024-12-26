interface QuoteCardContentProps {
  quote: string;
  title?: string;
  sourceTitle?: string;
  sourceUrl?: string;
}

export const QuoteCardContent = ({
  quote,
  title,
  sourceTitle,
  sourceUrl,
}: QuoteCardContentProps) => {
  return (
    <div className="space-y-2">
      {title && (
        <h4 className="font-bold text-lg text-[#2B4C7E]">{title}</h4>
      )}
      <div className="relative">
        <span className="absolute -top-4 -left-2 text-4xl text-[#33A1DE] opacity-20 font-serif leading-none">"</span>
        <div className="pl-4 pr-2 italic text-[#2B4C7E] leading-relaxed">
          {quote}
        </div>
        <span className="absolute -bottom-2 right-0 text-4xl text-[#33A1DE] opacity-20 font-serif leading-none rotate-180">"</span>
      </div>
      {sourceTitle && (
        <div className="text-sm text-[#33A1DE] mt-2 font-medium">
          From:{" "}
          {sourceUrl ? (
            <a
              href={sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#2B4C7E] transition-colors underline"
            >
              {sourceTitle}
            </a>
          ) : (
            <span>{sourceTitle}</span>
          )}
        </div>
      )}
    </div>
  );
};