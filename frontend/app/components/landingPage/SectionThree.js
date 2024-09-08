import Image from "next/image";

export default function SectionThree() {
  return (
    <div className="overflow-hidden bg-white py-24 sm:py-32 flex flex-col items-center">
      <h2 className="text-3xl font-bold text-gray-900 mb-8">Flowchart</h2>
      <div className="px-20">
        <Image
          src="/img/flowchart.png"
          alt="Product screenshot"
          className="max-w-full rounded-xl shadow-xl ring-1 ring-gray-400/10"
          width={2432}
          height={1442}
        />
      </div>
    </div>
  );
}
