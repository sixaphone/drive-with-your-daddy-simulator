'use client'
import { useState } from 'react';
import InputCars from './_components/InputCars';
import Simulation from './_components/Simulation';
import { Steps } from './_types';

export default function Home() {
  const [steps, setSteps] = useState<Steps>({ items: [], index: 0 });

  return (
    <div className="flex flex-col gap-4">
      <Simulation setSteps={setSteps} steps={steps} />

      <InputCars setSteps={setSteps} steps={steps} />
    </div>
  )
}
