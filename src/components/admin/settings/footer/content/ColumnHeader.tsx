interface ColumnHeaderProps {
  position: number;
}

export function ColumnHeader({ position }: ColumnHeaderProps) {
  return (
    <div className="absolute -top-3 left-4 px-2 py-1 bg-primary text-primary-foreground text-xs font-semibold rounded">
      Column {position}
    </div>
  );
}