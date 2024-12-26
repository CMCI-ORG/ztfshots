interface TextContentProps {
  title?: string;
  text: string;
}

export function TextContent({ title, text }: TextContentProps) {
  return (
    <div className="space-y-2">
      {title && (
        <h4 className="font-bold text-base text-foreground">{title}</h4>
      )}
      <p className="text-sm text-muted-foreground">{text}</p>
    </div>
  );
}