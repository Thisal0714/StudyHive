import Link from "next/link";

export default function CustomNotFound() {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <h1 className="text-4xl font-bold mb-4">404 — Page Not Found</h1>
        <p className="text-gray-600 mb-6">Looks like you’re lost in StudyHive 👻</p>
        <Link href="/" className="text-blue-600 underline hover:text-blue-800">Back to Home</Link>
      </div>
    );
  }
  