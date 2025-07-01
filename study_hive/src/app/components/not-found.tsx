import Image from "next/image";
import Link from "next/link";


export default function NotFound() {
  return (
    <section className="w-full h-screen flex flex-col justify-center items-center">
      <Image
        src="/images/block-user.png"
        alt="Unauthorized 404"
        width={700}
        height={450}
      />
      <h2 className="text-2xl text-black mb-5">
        You are not authorized to access this page.
      </h2>
      <Link
        href="/"
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Go Home
      </Link>
    </section>
  );
}
