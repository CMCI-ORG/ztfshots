import { QuotesTable } from "@/components/quotes/QuotesTable";
import { AddQuoteForm } from "@/components/quotes/AddQuoteForm";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useState } from "react";

const Quotes = () => {
  const [showAddForm, setShowAddForm] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Quotes</h1>
        <Button onClick={() => setShowAddForm(!showAddForm)}>
          <Plus className="mr-2 h-4 w-4" />
          {showAddForm ? 'Hide Form' : 'Add Quote'}
        </Button>
      </div>
      
      {showAddForm && (
        <div className="bg-card p-6 rounded-lg shadow-sm border">
          <h2 className="text-2xl font-semibold mb-6">Add New Quote</h2>
          <AddQuoteForm onSuccess={() => setShowAddForm(false)} />
        </div>
      )}
      
      <QuotesTable />
    </div>
  );
};

export default Quotes;