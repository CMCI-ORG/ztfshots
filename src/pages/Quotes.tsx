import { AdminLayout } from "@/components/layout/AdminLayout";
import { QuotesTable } from "@/components/quotes/QuotesTable";

const Quotes = () => {
  return (
    <main className="container mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-6 text-[#8B5CF6]">Quotes</h1>
      <QuotesTable />
    </main>
  );
};

export default Quotes;