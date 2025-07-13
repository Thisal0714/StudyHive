import Image from "next/image";
import Link from "next/link";

export default function UnderConstructionPage() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
      <div className="max-w-xl text-center">
        <Image
          src="/images/building_website.svg"
          alt="Under Construction"
          width={400}
          height={400}
          className="mx-auto mb-8"
        />
        <h1 className="text-5xl font-bold mb-4 text-blue-700">Oops!</h1>
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">
          Under Construction
        </h2>
        <div>
          <p className="text-gray-600 mb-8">
            We&apos;re working hard to bring you this page. It&apos;ll be live shortly—thank you for your patience!</p>
        </div>
      </div>
    </main>
  );
}
