import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TitleField } from "./fields/TitleField";
import { TaglineField } from "./fields/TaglineField";
import { BiographyField } from "./fields/BiographyField";
import { TextField } from "./fields/TextField";
import { SourceFields } from "./fields/SourceFields";

interface TranslationFieldsProps {
  langCode: string;
  langName: string;
  nativeName: string;
  translations: Record<string, any>;
  itemType: 'quotes' | 'categories' | 'pages_content' | 'site_settings' | 'authors';
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
        {itemType === 'authors' ? (
          <BiographyField
            langName={langName}
            value={getTranslationValue('bio')}
            onChange={(value) => onTranslationChange(langCode, 'bio', value)}
          />
        ) : (
          <>
            {(itemType === 'quotes' || itemType === 'pages_content' || itemType === 'site_settings') && (
              <TitleField
                langName={langName}
                value={getTranslationValue('title')}
                onChange={(value) => onTranslationChange(langCode, 'title', value)}
                itemType={itemType}
              />
            )}
            {itemType === 'site_settings' && (
              <TaglineField
                langName={langName}
                value={getTranslationValue('tag_line')}
                onChange={(value) => onTranslationChange(langCode, 'tag_line', value)}
              />
            )}
            <TextField
              langName={langName}
              value={getTranslationValue('text')}
              onChange={(value) => onTranslationChange(langCode, 'text', value)}
              itemType={itemType}
            />
            {itemType === 'quotes' && (
              <SourceFields
                langName={langName}
                sourceTitle={getTranslationValue('source_title')}
                sourceUrl={getTranslationValue('source_url')}
                onSourceTitleChange={(value) => onTranslationChange(langCode, 'source_title', value)}
                onSourceUrlChange={(value) => onTranslationChange(langCode, 'source_url', value)}
              />
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}