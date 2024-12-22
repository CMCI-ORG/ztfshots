import { MainLayout } from "@/components/layout/MainLayout";

const About = () => {
  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto space-y-8">
          <h1 className="text-4xl font-bold text-[#8B5CF6] text-center mb-8">
            About ZTFShots
          </h1>
          
          <div className="prose prose-lg max-w-none">
            <p className="text-gray-700 leading-relaxed mb-6">
              ZTFShots is a platform dedicated to sharing the timeless teachings and 
              inspirational quotes of Prof. Z.T. Fomum. Known for his deep insights 
              into faith, prayer, and Christian living, Prof. Fomum's words have 
              transformed countless lives across the globe.
            </p>
            
            <p className="text-gray-700 leading-relaxed">
              Our mission is to inspire individuals daily with bite-sized wisdom 
              that encourages spiritual growth and practical Christian living. 
              Whether through sharable quote cards, curated categories, or engaging 
              community features, ZTFShots is here to serve as a daily reminder of 
              God's faithfulness and love.
            </p>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default About;