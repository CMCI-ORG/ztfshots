import { MainLayout } from "@/components/layout/MainLayout";
import { useParams } from "react-router-dom";

const BlogPost = () => {
  const { slug } = useParams();

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Blog Post: {slug}</h1>
        <p className="text-gray-600">Coming soon...</p>
      </div>
    </MainLayout>
  );
};

export default BlogPost;