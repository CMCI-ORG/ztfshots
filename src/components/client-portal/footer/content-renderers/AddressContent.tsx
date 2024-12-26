interface AddressContentProps {
  content: {
    street: string;
    city: string;
    state: string;
    zip: string;
    phone?: string;
    email?: string;
  };
  title?: string;
}

export function AddressContent({ content, title }: AddressContentProps) {
  return (
    <div className="space-y-4">
      {title && (
        <h4 className="font-bold text-base text-foreground">{title}</h4>
      )}
      <div className="text-sm text-muted-foreground space-y-1">
        <p>{content.street}</p>
        <p>{content.city}, {content.state} {content.zip}</p>
        {content.phone && <p>Phone: {content.phone}</p>}
        {content.email && (
          <a 
            href={`mailto:${content.email}`}
            className="hover:text-primary"
          >
            {content.email}
          </a>
        )}
      </div>
    </div>
  );
}