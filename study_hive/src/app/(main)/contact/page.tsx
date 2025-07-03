// app/contact/page.tsx

import Image from "next/image";

export default function ContactPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-orange-50 p-8">
      <div className="flex flex-col md:flex-row max-w-5xl w-full bg-orange-100 rounded-lg shadow-md overflow-hidden">
        {/* Left side: Contact info */}
        <div className="flex-1 p-8">
          <p className="text-green-700 mb-2">How can we help you?</p>
         <h1 className="text-4xl font-bold text-black mb-4">Contact us</h1>
          <p className="mb-6 text-gray-800">
            We’re here to help and answer any questions you might have.
            We look forward to hearing from you!
          </p>
          <div className="space-y-4 text-gray-700">
            <div className="flex items-center gap-2">
              📍 Eheliyagoda, Rathnapura
            </div>
            <div className="flex items-center gap-2">
              📞 +94 71 366 8901
            </div>
            <div className="flex items-center gap-2">
              ✉️{" "}
              <a
                href="mailto:testz@gmail.com"
                className="text-blue-600 hover:underline"
              >
                testz@gmail.com
              </a>
            </div>
          </div>
        </div>

        {/* Right side: Illustration */}
        <div className="flex-1 flex items-center justify-center bg-orange-50 p-8">
          <Image
            src="/call-us-iconl.svg"
            alt="Hello Illustration"
            width={300}
            height={300}
          />
        </div>
      </div>
    </main>
  );
}
