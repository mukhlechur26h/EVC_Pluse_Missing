import { CalculatedReading } from "../types";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { TrendingUp, AlertCircle, Banknote, Droplets } from "lucide-react";

interface ReportSummaryProps {
  readings: CalculatedReading[];
}

export function ReportSummary({ readings }: ReportSummaryProps) {
  if (readings.length < 2) return null;

  const latest = readings[readings.length - 1];
  const totalMissingVolume = readings.reduce((acc, curr) => acc + curr.missingVolume, 0);
  const totalMissingAmount = readings.reduce((acc, curr) => acc + curr.amount, 0);
  const totalVbtConsumption = readings.reduce((acc, curr) => acc + curr.vbtConsumption, 0);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">বর্তমান মাসের ব্যবহার (VbT)</CardTitle>
          <Droplets className="h-4 w-4 text-blue-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{latest.vbtConsumption.toFixed(2)} m³</div>
          <p className="text-xs text-muted-foreground">
            গত মাসের তুলনায় {((latest.vbtConsumption / (readings[readings.length - 2].vbtConsumption || 1) - 1) * 100).toFixed(1)}% পরিবর্তন
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">পালস মিসিং ভলিউম</CardTitle>
          <AlertCircle className="h-4 w-4 text-orange-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{latest.missingVolume.toFixed(3)} m³</div>
          <p className="text-xs text-muted-foreground">
            মোট মিসিং: {totalMissingVolume.toFixed(3)} m³
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">মিসিং বিলের পরিমাণ</CardTitle>
          <Banknote className="h-4 w-4 text-green-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">৳ {latest.amount.toFixed(2)}</div>
          <p className="text-xs text-muted-foreground">
            মোট মিসিং বিল: ৳ {totalMissingAmount.toFixed(2)}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">সর্বমোট বিল (বর্তমান মাস)</CardTitle>
          <TrendingUp className="h-4 w-4 text-purple-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">৳ {latest.totalBill.toFixed(2)}</div>
          <p className="text-xs text-muted-foreground">
            মোট ব্যবহার: {(latest.vbtConsumption + latest.missingVolume).toFixed(2)} m³
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
