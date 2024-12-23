interface SubscriberStatusBadgeProps {
  status: string;
}

export function SubscriberStatusBadge({ status }: SubscriberStatusBadgeProps) {
  return (
    <span className={`px-2 py-1 rounded-full text-sm ${
      status === 'active' 
        ? 'bg-green-100 text-green-800' 
        : 'bg-red-100 text-red-800'
    }`}>
      {status}
    </span>
  );
}