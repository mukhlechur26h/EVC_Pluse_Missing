import { GasReading, CalculatedReading } from "../types";

export function calculateReadings(readings: GasReading[]): CalculatedReading[] {
  // Sort readings by date before calculation
  const sortedReadings = [...readings].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  return sortedReadings.map((current, index) => {
    if (index === 0) {
      return {
        ...current,
        mechConsumption: 0,
        vmtConsumption: 0,
        vbtConsumption: 0,
        pulseMissing: 0,
        cf: 0,
        missingVolume: 0,
        amount: 0,
        totalConsumption: 0,
        totalBill: 0,
      };
    }

    const previous = sortedReadings[index - 1];
    
    const mechConsumption = current.mechReading - previous.mechReading;
    const vmtConsumption = current.vmT - previous.vmT;
    const vbtConsumption = current.vbT - previous.vbT;
    
    // Pulse Missing = Mech Cons - Vmt Cons
    const pulseMissing = mechConsumption - vmtConsumption;
    
    // C.F = Vbt Cons / Vmt Cons
    const cf = vmtConsumption !== 0 ? vbtConsumption / vmtConsumption : 0;
    
    // Missing Volume = Pulse Missing * C.F
    const missingVolume = pulseMissing * cf;
    
    // Pulse Missing Amount = Missing Volume * Rate
    const amount = missingVolume * current.rate;
    
    const totalConsumption = vbtConsumption + missingVolume;
    const totalBill = totalConsumption * current.rate;

    return {
      ...current,
      mechConsumption,
      vmtConsumption,
      vbtConsumption,
      pulseMissing,
      cf,
      missingVolume,
      amount,
      totalConsumption,
      totalBill,
    };
  });
}
