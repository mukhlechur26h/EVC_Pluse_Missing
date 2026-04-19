import React, { useState, useEffect } from "react";
import { GasReading } from "../types";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { PlusCircle, Save, X } from "lucide-react";

interface ReadingFormProps {
  customerId: string;
  onAddReading: (reading: GasReading) => void;
  onUpdateReading: (reading: GasReading) => void;
  editReading: GasReading | null;
  onCancelEdit: () => void;
}

export function ReadingForm({ 
  customerId, 
  onAddReading, 
  onUpdateReading, 
  editReading, 
  onCancelEdit 
}: ReadingFormProps) {
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split("T")[0],
    mechReading: "",
    vmT: "",
    vbT: "",
    rate: "35",
  });

  useEffect(() => {
    if (editReading) {
      setFormData({
        date: editReading.date,
        mechReading: editReading.mechReading.toString(),
        vmT: editReading.vmT.toString(),
        vbT: editReading.vbT.toString(),
        rate: editReading.rate.toString(),
      });
    } else {
      setFormData((prev) => ({
        ...prev,
        mechReading: "",
        vmT: "",
        vbT: "",
      }));
    }
  }, [editReading]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const readingData: GasReading = {
      id: editReading ? editReading.id : crypto.randomUUID(),
      customerId: customerId,
      date: formData.date,
      mechReading: parseFloat(formData.mechReading),
      vmT: parseFloat(formData.vmT),
      vbT: parseFloat(formData.vbT),
      rate: parseFloat(formData.rate),
    };

    if (editReading) {
      onUpdateReading(readingData);
    } else {
      onAddReading(readingData);
    }

    if (!editReading) {
      setFormData((prev) => ({
        ...prev,
        mechReading: "",
        vmT: "",
        vbT: "",
      }));
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          {editReading ? <Save className="w-5 h-5 text-blue-600" /> : <PlusCircle className="w-5 h-5 text-green-600" />}
          {editReading ? "রিডিং ইডিট করুন" : "নতুন রিডিং যোগ করুন"}
        </CardTitle>
        {editReading && (
          <Button variant="ghost" size="icon" onClick={onCancelEdit}>
            <X className="w-4 h-4" />
          </Button>
        )}
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="date">Date</Label>
            <Input
              id="date"
              name="date"
              type="date"
              value={formData.date}
              onChange={handleChange}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="mechReading">Mech Reading</Label>
            <Input
              id="mechReading"
              name="mechReading"
              type="number"
              step="any"
              value={formData.mechReading}
              onChange={handleChange}
              placeholder="উদা: 768326"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="vmT">VmT</Label>
            <Input
              id="vmT"
              name="vmT"
              type="number"
              step="any"
              value={formData.vmT}
              onChange={handleChange}
              placeholder="উদা: 768286"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="vbT">VbT</Label>
            <Input
              id="vbT"
              name="vbT"
              type="number"
              step="any"
              value={formData.vbT}
              onChange={handleChange}
              placeholder="উদা: 1134694"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="rate">Rate per m³</Label>
            <Input
              id="rate"
              name="rate"
              type="number"
              step="any"
              value={formData.rate}
              onChange={handleChange}
              placeholder="উদা: 35"
              required
            />
          </div>
          <div className="md:col-span-2 lg:col-span-3 pt-2 flex gap-2">
            <Button type="submit" className="flex-1">
              {editReading ? "আপডেট করুন" : "ডাটা যোগ করুন"}
            </Button>
            {editReading && (
              <Button type="button" variant="outline" onClick={onCancelEdit}>
                বাতিল
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
