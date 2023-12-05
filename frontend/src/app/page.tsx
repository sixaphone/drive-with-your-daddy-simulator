import Image from 'next/image'

export default function Home() {
  const noOfRows = 9;
  const noOfColumns = 17;

  return (
    <div className="flex flex-col flex-nowrap justify-center items-center gap-1">
      {Array(noOfRows).fill(null).map((_, rowIndex) => (
        <div className="flex flex-row flex-nowrap gap-1">
          {Array(noOfColumns).fill(null).map((_, columnIndex) => (
            <div className="w-16 h-12 bg-blue-500"></div>
          ))}
        </div>
      ))}
    </div>
  )
}
