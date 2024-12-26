import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface TranslationFieldsProps {
  langCode: string;
  langName: string;
  nativeName: string;
  translations: Record<string, any>;
  itemType: 'quotes' | 'categories' | 'pages_content' | 'site_settings';
  onTranslationChange: (langCode: string, field: string, value: string) => void;
}

export function TranslationFields({
  langCode,
  langName,
  nativeName,
  translations,
  itemType,
  onTranslationChange,
}: TranslationFieldsProps) {
  // Helper function to safely get translation value
  const getTranslationValue = (field: string) => {
    return translations[langCode]?.[field] || "";
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">
          {langName} ({nativeName})
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {(itemType === 'quotes' || itemType === 'pages_content' || itemType === 'site_settings') && (
          <div className="space-y-1">
            <label className="text-sm font-medium">
              {itemType === 'site_settings' ? 'Site Name' : 'Title'}
            </label>
            <Input
              value={getTranslationValue('title')}
              onChange={(e) =>
                onTranslationChange(langCode, "title", e.target.value)
              }
              placeholder={`Enter ${itemType === 'site_settings' ? 'site name' : 'title'} in ${langName}`}
            />
          </div>
        )}
        {itemType === 'site_settings' && (
          <div className="space-y-1">
            <label className="text-sm font-medium">Tagline</label>
            <Input
              value={getTranslationValue('tag_line')}
              onChange={(e) =>
                onTranslationChange(langCode, "tag_line", e.target.value)
              }
              placeholder={`Enter tagline in ${langName}`}
            />
          </div>
        )}
        <div className="space-y-1">
          <label className="text-sm font-medium">
            {itemType === 'site_settings' ? 'Description' : 'Text'}
          </label>
          <Textarea
            value={getTranslationValue('text')}
            onChange={(e) =>
              onTranslationChange(langCode, "text", e.target.value)
            }
            placeholder={`Enter ${itemType === 'site_settings' ? 'description' : 'text'} in ${langName}`}
          />
        </div>
        {itemType === 'quotes' && (
          <>
            <div className="space-y-1">
              <label className="text-sm font-medium">Source Title</label>
              <Input
                value={getTranslationValue('source_title')}
                onChange={(e) =>
                  onTranslationChange(langCode, "source_title", e.target.value)
                }
                placeholder={`Enter source title in ${langName}`}
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium">Source URL</label>
              <Input
                value={getTranslationValue('source_url')}
                onChange={(e) =>
                  onTranslationChange(langCode, "source_url", e.target.value)
                }
                placeholder={`Enter source URL in ${langName}`}
              />
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}