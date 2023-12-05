'use client'
import { useCallback, useState } from 'react';
import { Car } from '../_types';

interface InputCarProps {
  cars: Car[];
  index: number;
  setCars: (cars: Car[]) => void;
};

export default function InputCar({ cars, index, setCars }: InputCarProps) {
  const [car, setCar] = useState<Car>({});
  const [error, setError] = useState('');

  const validate = useCallback((key: string, value: number) => {
    setError('');

    if (key === 'x' && (value < 1 || value > 9)) {
      setError('X must be between 1 and 9');
      return false;
    }

    if (key === 'y' && (value < 1 || value > 17)) {
      setError('Y must be between 1 and 17');
      return false;
    }

    return true;
  }, []);

  const onStartChange = (e: any) => {
    const value = parseInt(e.target.value);
    const key = e.target.name;

    if (validate(key, value)) {
      const updated = { ...car, start: { ...(car.start ?? {}), [key]: value - 1 } };
      setCar(updated);
      setCars(cars.map((car, idx) => idx === index ? updated : car));
    }
  }

  const onEndChange = (e: any) => {
    const value = parseInt(e.target.value);
    const key = e.target.name;

    if (validate(key, value)) {
      const updated = { ...car, end: { ...(car.end ?? {}), [key]: value - 1 } };
      setCar(updated);
      setCars(cars.map((car, idx) => idx === index ? updated : car));
    }
  }

  const onIsEmergencyChanged = (e: any) => {
    const updated = { ...car, isEmergency: e.target.checked };
    setCar(updated);
    setCars(cars.map((car, idx) => idx === index ? updated : car));
  }

  return (
    <>
      {error && <p className="w-full text-center text-red-500">{error}</p>}
      <div className="w-full flex flex-wrap gap-2 mt-2 text-center justify-center">
        <label>Start position</label>
        <input onChange={onStartChange} name="x" className="border text-center w-10 h-7 rounded border-gray-400" placeholder='x'></input>
        <input onChange={onStartChange} name="y" className="border text-center w-10 h-7 rounded border-gray-400" placeholder='y'></input>

        <label>End position</label>
        <input onChange={onEndChange} name="x" className="border text-center w-10 h-7 rounded border-gray-400" placeholder='x'></input>
        <input onChange={onEndChange} name="y" className="border text-center w-10 h-7 rounded border-gray-400" placeholder='y'></input>

        <input onChange={onIsEmergencyChanged} name='isEmergency' id="isEmergency" type='checkbox'></input>
        <label htmlFor="isEmergency">Mark as emergency car</label>
      </div>
    </>
  )
}
