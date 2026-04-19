import React, { useState, useRef } from "react";
import { Customer } from "../types";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Users, Plus, UserPlus, Trash2, Upload, Edit2 } from "lucide-react";

interface CustomerManagementProps {
  customers: Customer[];
  selectedCustomerId: string | null;
  onSelectCustomer: (id: string) => void;
  onAddCustomer: (customer: Customer) => void;
  onUpdateCustomer: (customer: Customer) => void;
  onImportCustomers: (customers: Customer[]) => void;
  onDeleteCustomer: (id: string) => void;
}

export function CustomerManagement({
  customers,
  selectedCustomerId,
  onSelectCustomer,
  onAddCustomer,
  onUpdateCustomer,
  onImportCustomers,
  onDeleteCustomer,
}: CustomerManagementProps) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const customerFileInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState({
    name: "",
    customerCode: "",
    address: "",
    meterType: "EVC",
    meterNo: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingCustomer) {
      onUpdateCustomer({
        ...editingCustomer,
        ...formData,
      });
      setEditingCustomer(null);
    } else {
      const newCustomer: Customer = {
        id: crypto.randomUUID(),
        ...formData,
      };
      onAddCustomer(newCustomer);
    }
    setFormData({ name: "", customerCode: "", address: "", meterType: "EVC", meterNo: "" });
    setShowAddForm(false);
  };

  const handleEditClick = (customer: Customer) => {
    setEditingCustomer(customer);
    setFormData({
      name: customer.name,
      customerCode: customer.customerCode,
      address: customer.address,
      meterType: customer.meterType,
      meterNo: customer.meterNo,
    });
    setShowAddForm(true);
  };

  const handleCancelEdit = () => {
    setEditingCustomer(null);
    setFormData({ name: "", customerCode: "", address: "", meterType: "EVC", meterNo: "" });
    setShowAddForm(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImportCSV = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      const lines = text.split("\n");
      const newCustomers: Customer[] = [];

      for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(",");
        if (values.length < 5) continue;

        const customer: Customer = {
          id: crypto.randomUUID(),
          name: values[0].trim(),
          customerCode: values[1].trim(),
          address: values[2].trim(),
          meterType: values[3].trim(),
          meterNo: values[4].trim(),
        };

        if (customer.name && customer.customerCode) {
          newCustomers.push(customer);
        }
      }

      if (newCustomers.length > 0) {
        onImportCustomers(newCustomers);
        alert(`${newCustomers.length} জন গ্রাহক সফলভাবে ইমপোর্ট করা হয়েছে।`);
      }
    };
    reader.readAsText(file);
    if (customerFileInputRef.current) customerFileInputRef.current.value = "";
  };

  return (
    <div className="space-y-4">
      <Card className="border-blue-100 bg-blue-50/30">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-lg font-bold flex items-center gap-2">
            <Users className="w-5 h-5 text-blue-600" />
            গ্রাহক নির্বাচন করুন
          </CardTitle>
          <div className="flex items-center gap-2">
            <input
              type="file"
              accept=".csv"
              className="hidden"
              ref={customerFileInputRef}
              onChange={handleImportCSV}
            />
            <Button
              size="sm"
              variant="outline"
              onClick={() => customerFileInputRef.current?.click()}
              className="flex items-center gap-1"
            >
              <Upload className="w-4 h-4" /> ইমপোর্ট তালিকা
            </Button>
            <Button 
              size="sm" 
              variant={showAddForm ? "outline" : "default"}
              onClick={() => {
                if (showAddForm && editingCustomer) {
                  handleCancelEdit();
                } else {
                  setShowAddForm(!showAddForm);
                }
              }}
              className="flex items-center gap-1"
            >
              {showAddForm ? "বন্ধ করুন" : <><Plus className="w-4 h-4" /> নতুন গ্রাহক</>}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {showAddForm ? (
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-2 p-4 bg-white rounded-lg border border-blue-100">
              <div className="space-y-2">
                <Label htmlFor="name">গ্রাহকের নাম</Label>
                <Input id="name" name="name" value={formData.name} onChange={handleChange} required placeholder="উদা: জন ডো" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="customerCode">গ্রাহক সংকেত নং (Code)</Label>
                <Input id="customerCode" name="customerCode" value={formData.customerCode} onChange={handleChange} required placeholder="উদা: C-001" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">ঠিকানা</Label>
                <Input id="address" name="address" value={formData.address} onChange={handleChange} required placeholder="উদা: ঢাকা, বাংলাদেশ" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="meterType">মিটার টাইপ</Label>
                <Input id="meterType" name="meterType" value={formData.meterType} onChange={handleChange} required placeholder="উদা: EVC" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="meterNo">মিটার নং</Label>
                <Input id="meterNo" name="meterNo" value={formData.meterNo} onChange={handleChange} required placeholder="উদা: 123456" />
              </div>
              <div className="md:col-span-2 lg:col-span-1 flex items-end gap-2">
                <Button type="submit" className="flex-1 flex items-center gap-2">
                  {editingCustomer ? <><Edit2 className="w-4 h-4" /> আপডেট করুন</> : <><UserPlus className="w-4 h-4" /> গ্রাহক তৈরি করুন</>}
                </Button>
                {editingCustomer && (
                  <Button type="button" variant="outline" onClick={handleCancelEdit}>
                    বাতিল
                  </Button>
                )}
              </div>
            </form>
          ) : (
            <div className="flex flex-wrap gap-2 mt-2">
              {customers.length === 0 ? (
                <p className="text-sm text-muted-foreground py-2">কোন গ্রাহক নেই। অনুগ্রহ করে নতুন গ্রাহক যোগ করুন।</p>
              ) : (
                customers.map((customer) => (
                  <div key={customer.id} className="flex items-center gap-1 bg-white border rounded-md pr-1">
                    <Button
                      variant={selectedCustomerId === customer.id ? "default" : "ghost"}
                      onClick={() => onSelectCustomer(customer.id)}
                      className="h-auto py-2 px-4 flex flex-col items-start gap-0 border-none rounded-r-none"
                    >
                      <span className="font-bold">{customer.name}</span>
                      <span className="text-[10px] opacity-70">কোড: {customer.customerCode} | মিটার: {customer.meterNo}</span>
                    </Button>
                    <div className="flex flex-col gap-0.5">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 text-blue-600 hover:bg-blue-50"
                        onClick={() => handleEditClick(customer)}
                      >
                        <Edit2 className="w-3 h-3" />
                      </Button>
                      {selectedCustomerId !== customer.id && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 text-destructive hover:bg-destructive/10"
                          onClick={() => onDeleteCustomer(customer.id)}
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {selectedCustomerId && (
        <div className="bg-white border border-slate-200 rounded-lg p-4 flex flex-wrap gap-6 text-sm">
          <div className="flex flex-col">
            <span className="text-slate-500 font-medium">গ্রাহকের নাম</span>
            <span className="font-bold text-slate-900">{customers.find(c => c.id === selectedCustomerId)?.name}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-slate-500 font-medium">সংকেত নং</span>
            <span className="font-bold text-blue-600">{customers.find(c => c.id === selectedCustomerId)?.customerCode}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-slate-500 font-medium">ঠিকানা</span>
            <span className="font-semibold text-slate-700">{customers.find(c => c.id === selectedCustomerId)?.address}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-slate-500 font-medium">মিটার টাইপ</span>
            <span className="font-semibold text-slate-700">{customers.find(c => c.id === selectedCustomerId)?.meterType}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-slate-500 font-medium">মিটার নং</span>
            <span className="font-bold text-blue-600">{customers.find(c => c.id === selectedCustomerId)?.meterNo}</span>
          </div>
        </div>
      )}
    </div>
  );
}
