import { useParams } from "react-router-dom";
import { DynamicContent } from "@/components/client-portal/content/DynamicContent";
import { ContentLayout } from "@/components/client-portal/content/ContentLayout";

const DynamicPage = () => {
  const { pageKey } = useParams();

  if (!pageKey) {
    return <div>Page not found</div>;
  }

  return (
    <ContentLayout>
      <DynamicContent pageKey={pageKey} />
    </ContentLayout>
  );
};

export default DynamicPage;