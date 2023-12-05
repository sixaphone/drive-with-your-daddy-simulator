'use client'
import { useMemo, useState } from 'react';
import InputCar from './InputCar';
import { Car, Steps } from '../_types';

interface InputCarsProps {
  setSteps: (steps: Steps) => void;
  steps: Steps;
}

export default function InputCars({ steps, setSteps }: InputCarsProps) {
  const [cars, setCars] = useState<Car[]>([]);
  const [noOfCars, setNoOfCars] = useState(0);
  const [error, setError] = useState('');
  const canEdit = useMemo(() => {
    return steps.items.length === 0;
  }, [steps]);
  const enabled = useMemo(() => {
    return noOfCars
      && cars.length
      && cars.every(car => canEdit && car.start && car.end && !isNaN(car.start.x!) && !isNaN(car.start.y!) && !isNaN(car.end.x!) && !isNaN(car.end.y!));
  }, [cars, noOfCars]);

  const onEnterCars = (e: any) => {
    const value = parseInt(e.target.value);
    setError('');

    if (value > 0 && value < 11) {
      setNoOfCars(value);
      const updated = cars.length > value
        ? cars.slice(0, value)
        : [...cars, ...Array(value - cars.length).fill({})]

      setCars(updated);
      return;
    }

    setError('Number of cars must be between 1 and 10');
  }

  const onClick = async () => {
    if (!enabled) {
      return;
    }

    const response = await fetch('http://localhost:8080/simulate', {
      method: 'POST',
      body: JSON.stringify({ cars }),
      headers: {
        'content-type': 'application/json',
        'accept': 'application/json'
      }
    });

    const items = await response.json();
    setSteps({
      items,
      index: 0
    });
    setNoOfCars(0);
    setCars([]);
  }

  return (
    <div className="w-full">
      <div className='w-full flex justify-center gap-4'>
        <div className="flex justify-end gap-4 items-center">
          <label htmlFor="noOfCars">Enter number of cars: </label>
          <input disabled={!canEdit} onChange={onEnterCars} value={noOfCars} id="noOfCars" className='text-center border w-10 h-7 rounded border-gray-400'></input>
        </div>
        <div className='flex justify-start'>
          <button
            disabled={!enabled}
            className={`px-10 py-2 border border-gray-300 rounded uppercase ${enabled ? 'bg-blue-400' : 'bg-gray-50'}`}
            onClick={onClick}
          >
            Run
          </button>
        </div>
      </div>

      {error !== '' && (<div className='w-full flex justify-center mt-4 text-red-500'>{error}</div>)}

      {noOfCars > 0 && (
        <>
          <h3 className="w-full text-center">Enter cars positions (coordinates will be transformed to indexes)</h3>
          <div className='w-full'>
            {Array(noOfCars).fill(null).map((_, index) => (
              <InputCar key={index} index={index} cars={cars} setCars={setCars} />
            ))}
          </div>
        </>
      )}

    </div>
  )
}
