import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { TranslatableItem } from "../types";

interface OriginalContentProps {
  item: TranslatableItem;
  itemType: 'quotes' | 'categories' | 'pages_content' | 'site_settings' | 'authors';
}

export function OriginalContent({ item, itemType }: OriginalContentProps) {
  const getDisplayText = () => {
    if (itemType === 'categories') return item.name || '';
    if (itemType === 'pages_content') return item.content || '';
    if (itemType === 'site_settings') return item.description || '';
    if (itemType === 'authors') return item.bio || '';
    return item.text || '';
  };

  const getDisplayTitle = () => {
    if (itemType === 'categories') return item.name || '';
    if (itemType === 'site_settings') return item.site_name || '';
    if (itemType === 'authors') return item.name || '';
    if (itemType === 'quotes') return item.title || '';
    return item.title || '';
  };

  return (
    <div className="space-y-2">
      <h3 className="font-medium">Original Content in {item.primary_language?.toUpperCase()}</h3>
      {(itemType === 'quotes' || itemType === 'pages_content' || itemType === 'site_settings' || itemType === 'authors') && (
        <div className="space-y-1">
          <label className="text-sm font-medium">
            {itemType === 'site_settings' ? 'Site Name' : 
             itemType === 'authors' ? 'Name (Non-translatable)' : 'Title'}
          </label>
          <Input value={getDisplayTitle()} disabled />
        </div>
      )}
      {itemType === 'site_settings' && (
        <div className="space-y-1">
          <label className="text-sm font-medium">Tagline</label>
          <Input value={item.tag_line || ''} disabled />
        </div>
      )}
      <div className="space-y-1">
        <label className="text-sm font-medium">
          {itemType === 'site_settings' ? 'Description' : 
           itemType === 'authors' ? 'Biography' : 'Text'}
        </label>
        <Textarea value={getDisplayText()} disabled />
      </div>
      {itemType === 'quotes' && (
        <>
          <div className="space-y-1">
            <label className="text-sm font-medium">Source Title</label>
            <Input value={item.source_title || ''} disabled />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium">Source URL</label>
            <Input value={item.source_url || ''} disabled />
          </div>
        </>
      )}
    </div>
  );
}