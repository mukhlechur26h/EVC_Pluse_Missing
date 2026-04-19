export interface Customer {
  id: string;
  name: string;
  customerCode: string;
  address: string;
  meterType: string;
  meterNo: string;
}

export interface GasReading {
  id: string;
  customerId: string;
  date: string;
  mechReading: number;
  vmT: number;
  vbT: number;
  rate: number;
}

export interface CalculatedReading extends GasReading {
  mechConsumption: number;
  vmtConsumption: number;
  vbtConsumption: number;
  pulseMissing: number;
  cf: number;
  missingVolume: number;
  amount: number;
  totalConsumption: number;
  totalBill: number;
}
