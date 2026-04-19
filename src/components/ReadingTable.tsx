import { CalculatedReading } from "../types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Trash2, Edit2 } from "lucide-react";
import { Button } from "./ui/button";

interface ReadingTableProps {
  readings: CalculatedReading[];
  onDelete: (id: string) => void;
  onEdit: (reading: CalculatedReading) => void;
}

export function ReadingTable({ readings, onDelete, onEdit }: ReadingTableProps) {
  return (
    <Card className="w-full overflow-hidden">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">গ্যাস ব্যবহারের বিস্তারিত রিপোর্ট</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="whitespace-nowrap">Date</TableHead>
                <TableHead className="whitespace-nowrap">Mech Reading</TableHead>
                <TableHead className="whitespace-nowrap">Mech Cons.</TableHead>
                <TableHead className="whitespace-nowrap">VmT</TableHead>
                <TableHead className="whitespace-nowrap">Vmt Cons.</TableHead>
                <TableHead className="whitespace-nowrap">VbT</TableHead>
                <TableHead className="whitespace-nowrap">Vbt Cons.</TableHead>
                <TableHead className="whitespace-nowrap text-orange-600">P.Missing </TableHead>
                <TableHead className="whitespace-nowrap">C.F</TableHead>
                <TableHead className="whitespace-nowrap text-orange-600">Missing Vol.</TableHead>
                <TableHead className="whitespace-nowrap">Rate</TableHead>
                <TableHead className="whitespace-nowrap text-green-700">Missing Amount(Tk)</TableHead>
                <TableHead className="whitespace-nowrap">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {readings.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={13} className="text-center py-8 text-muted-foreground">
                    কোন ডাটা পাওয়া যায়নি। অনুগ্রহ করে নতুন রিডিং যোগ করুন।
                  </TableCell>
                </TableRow>
              ) : (
                readings.map((reading, index) => (
                  <TableRow key={reading.id} className="hover:bg-muted/30 transition-colors">
                    <TableCell className="font-medium">{reading.date}</TableCell>
                    <TableCell>{reading.mechReading.toLocaleString()}</TableCell>
                    <TableCell className="text-blue-600 font-mono">
                      {index === 0 ? "-" : reading.mechConsumption.toFixed(2)}
                    </TableCell>
                    <TableCell>{reading.vmT.toLocaleString()}</TableCell>
                    <TableCell className="text-blue-600 font-mono">
                      {index === 0 ? "-" : reading.vmtConsumption.toFixed(2)}
                    </TableCell>
                    <TableCell>{reading.vbT.toLocaleString()}</TableCell>
                    <TableCell className="text-blue-600 font-mono">
                      {index === 0 ? "-" : reading.vbtConsumption.toFixed(2)}
                    </TableCell>
                    <TableCell className="text-orange-600 font-bold">
                      {index === 0 ? "-" : reading.pulseMissing.toFixed(2)}
                    </TableCell>
                    <TableCell className="font-mono">
                      {index === 0 ? "-" : reading.cf.toFixed(4)}
                    </TableCell>
                    <TableCell className="text-orange-600 font-mono">
                      {index === 0 ? "-" : reading.missingVolume.toFixed(3)}
                    </TableCell>
                    <TableCell>{reading.rate}</TableCell>
                    <TableCell className="font-bold text-green-700">
                      {index === 0 ? "-" : reading.amount.toFixed(2)}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => onEdit(reading)}
                          className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                        >
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => onDelete(reading.id)}
                          className="text-destructive hover:text-destructive hover:bg-destructive/10"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
