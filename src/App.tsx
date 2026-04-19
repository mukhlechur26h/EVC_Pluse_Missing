import React, { useState, useEffect, useRef } from "react";
import { Customer, GasReading, CalculatedReading } from "./types";
import { calculateReadings } from "./lib/calculations";
import { ReadingForm } from "./components/ReadingForm";
import { ReadingTable } from "./components/ReadingTable";
import { ReportSummary } from "./components/ReportSummary";
import { ConsumptionChart } from "./components/ConsumptionChart";
import { CustomerManagement } from "./components/CustomerManagement";
import { Flame, FileText, Download, Users, Upload } from "lucide-react";
import { Button } from "./components/ui/button";

const INITIAL_CUSTOMERS: Customer[] = [
  { id: "c1", name: "নমুনা গ্রাহক ১", customerCode: "C-001", address: "ঢাকা", meterType: "EVC", meterNo: "M-1001" }
];

const INITIAL_READINGS: GasReading[] = [
  { id: "1", customerId: "c1", date: "2025-07-27", mechReading: 768326, vmT: 768286, vbT: 1134694, rate: 35 },
  { id: "2", customerId: "c1", date: "2025-08-27", mechReading: 830660, vmT: 830605, vbT: 1211577, rate: 35 },
  { id: "3", customerId: "c1", date: "2025-09-29", mechReading: 911252, vmT: 911197, vbT: 1299649, rate: 35 },
  { id: "4", customerId: "c1", date: "2025-10-28", mechReading: 982202, vmT: 982147, vbT: 1373146, rate: 35 },
  { id: "5", customerId: "c1", date: "2025-11-26", mechReading: 1054087, vmT: 1054032, vbT: 1445803, rate: 35 },
  { id: "6", customerId: "c1", date: "2025-12-28", mechReading: 1135410, vmT: 1135357, vbT: 1527245, rate: 35 },
  { id: "7", customerId: "c1", date: "2026-01-25", mechReading: 1198852, vmT: 1198800, vbT: 1590437, rate: 35 },
  { id: "8", customerId: "c1", date: "2026-02-25", mechReading: 1272491, vmT: 1272438, vbT: 1664793, rate: 35 },
  { id: "9", customerId: "c1", date: "2026-03-29", mechReading: 1342057, vmT: 1342002, vbT: 1739245, rate: 35 },
];

export default function App() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [customers, setCustomers] = useState<Customer[]>(() => {
    const saved = localStorage.getItem("gas_customers");
    return saved ? JSON.parse(saved) : INITIAL_CUSTOMERS;
  });

  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(() => {
    return customers.length > 0 ? customers[0].id : null;
  });

  const [readings, setReadings] = useState<GasReading[]>(() => {
    const saved = localStorage.getItem("gas_readings");
    return saved ? JSON.parse(saved) : INITIAL_READINGS;
  });

  const [editReading, setEditReading] = useState<GasReading | null>(null);
  const [calculatedReadings, setCalculatedReadings] = useState<CalculatedReading[]>([]);

  useEffect(() => {
    localStorage.setItem("gas_customers", JSON.stringify(customers));
  }, [customers]);

  useEffect(() => {
    localStorage.setItem("gas_readings", JSON.stringify(readings));
    if (selectedCustomerId) {
      const customerReadings = readings.filter(r => r.customerId === selectedCustomerId);
      setCalculatedReadings(calculateReadings(customerReadings));
    } else {
      setCalculatedReadings([]);
    }
  }, [readings, selectedCustomerId]);

  const addCustomer = (newCustomer: Customer) => {
    setCustomers(prev => [...prev, newCustomer]);
    setSelectedCustomerId(newCustomer.id);
  };

  const addCustomers = (newCustomers: Customer[]) => {
    setCustomers(prev => [...prev, ...newCustomers]);
    if (!selectedCustomerId && newCustomers.length > 0) {
      setSelectedCustomerId(newCustomers[0].id);
    }
  };

  const updateCustomer = (updatedCustomer: Customer) => {
    setCustomers(prev => prev.map(c => c.id === updatedCustomer.id ? updatedCustomer : c));
  };

  const deleteCustomer = (id: string) => {
    setCustomers(prev => prev.filter(c => c.id !== id));
    setReadings(prev => prev.filter(r => r.customerId !== id));
    if (selectedCustomerId === id) {
      setSelectedCustomerId(customers.length > 1 ? customers[0].id : null);
    }
  };

  const addReading = (newReading: GasReading) => {
    setReadings((prev) => [...prev, newReading]);
  };

  const updateReading = (updatedReading: GasReading) => {
    setReadings((prev) => prev.map(r => r.id === updatedReading.id ? updatedReading : r));
    setEditReading(null);
  };

  const deleteReading = (id: string) => {
    setReadings((prev) => prev.filter((r) => r.id !== id));
  };

  const exportToCSV = () => {
    if (!selectedCustomerId) return;
    const customer = customers.find(c => c.id === selectedCustomerId);
    const headers = [
      "Date", "Mech Reading", "VmT", "VbT", "Rate"
    ];
    
    const rows = calculatedReadings.map(r => [
      r.date, r.mechReading, r.vmT, r.vbT, r.rate
    ]);

    const csvContent = [
      headers, 
      ...rows
    ].map(e => e.join(",")).join("\n");
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `gas_data_${customer?.customerCode}_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleImportCSV = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !selectedCustomerId) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      const lines = text.split("\n");
      const headers = lines[0].split(",");
      
      const newReadings: GasReading[] = [];
      
      for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(",");
        if (values.length < 5) continue;
        
        const reading: GasReading = {
          id: crypto.randomUUID(),
          customerId: selectedCustomerId,
          date: values[0].trim(),
          mechReading: parseFloat(values[1]),
          vmT: parseFloat(values[2]),
          vbT: parseFloat(values[3]),
          rate: parseFloat(values[4]) || 35,
        };
        
        if (!isNaN(reading.mechReading)) {
          newReadings.push(reading);
        }
      }
      
      if (newReadings.length > 0) {
        setReadings(prev => [...prev, ...newReadings]);
        alert(`${newReadings.length} টি ডাটা সফলভাবে ইমপোর্ট করা হয়েছে।`);
      }
    };
    reader.readAsText(file);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans pb-12">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-orange-100 p-2 rounded-lg">
              <Flame className="w-6 h-6 text-orange-600" />
            </div>
            <h1 className="text-xl font-bold tracking-tight text-slate-900">
              ইভিসিযুক্ত মিটারের গ্যাস বিল ক্যালকুলেটর
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <input 
              type="file" 
              accept=".csv" 
              className="hidden" 
              ref={fileInputRef} 
              onChange={handleImportCSV} 
            />
            <Button 
              variant="outline" 
              size="sm" 
              className="hidden sm:flex items-center gap-2" 
              onClick={() => fileInputRef.current?.click()}
              disabled={!selectedCustomerId}
            >
              <Upload className="w-4 h-4" />
              ইমপোর্ট CSV
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="hidden sm:flex items-center gap-2" 
              onClick={exportToCSV} 
              disabled={!selectedCustomerId}
            >
              <Download className="w-4 h-4" />
              এক্সপোর্ট CSV
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Customer Management */}
        <CustomerManagement 
          customers={customers}
          selectedCustomerId={selectedCustomerId}
          onSelectCustomer={setSelectedCustomerId}
          onAddCustomer={addCustomer}
          onUpdateCustomer={updateCustomer}
          onImportCustomers={addCustomers}
          onDeleteCustomer={deleteCustomer}
        />

        {selectedCustomerId ? (
          <>
            {/* Stats Grid */}
            <ReportSummary readings={calculatedReadings} />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Column: Form */}
              <div className="lg:col-span-1 space-y-8">
                <ReadingForm 
                  customerId={selectedCustomerId}
                  onAddReading={addReading} 
                  onUpdateReading={updateReading}
                  editReading={editReading}
                  onCancelEdit={() => setEditReading(null)}
                />
                <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 text-sm text-blue-800">
                  <h3 className="font-semibold mb-2 flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    হিসাবের সূত্রসমূহ:
                  </h3>
                  <ul className="list-disc list-inside space-y-1 opacity-90">
                    <li>Pulse Missing = Mech Cons - Vmt Cons</li>
                    <li>C.F = Vbt Cons / Vmt Cons</li>
                    <li>Missing Volume = Pulse Missing * C.F</li>
                    <li>Missing Amount = Missing Volume * Rate</li>
                  </ul>
                </div>
              </div>

              {/* Right Column: Chart & Table */}
              <div className="lg:col-span-2 space-y-8">
                <ConsumptionChart readings={calculatedReadings} />
                <ReadingTable 
                  readings={calculatedReadings} 
                  onDelete={deleteReading} 
                  onEdit={(r) => setEditReading(r)}
                />
              </div>
            </div>
          </>
        ) : (
          <div className="text-center py-20 bg-white border border-dashed border-slate-300 rounded-2xl">
            <Users className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-slate-600">কোন গ্রাহক নির্বাচিত নেই</h2>
            <p className="text-slate-400">অনুগ্রহ করে উপর থেকে একজন গ্রাহক নির্বাচন করুন অথবা নতুন গ্রাহক যোগ করুন।</p>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="max-w-7xl mx-auto px-4 text-center text-slate-500 text-sm mt-8">
        <p>© {new Date().getFullYear()} গ্যাস বিল ম্যানেজমেন্ট সিস্টেম। সকল অধিকার সংরক্ষিত।</p>
      </footer>
    </div>
  );
}
