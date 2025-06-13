import Image from "next/image";
import { ReactNode } from "react";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <section className="grid grid-cols-1 md:grid-cols-[0.8fr_1fr]">
      <div className="bg-[#fA7275] min-h-screen text-zinc-100 space-y-8 flex flex-col items-center justify-center order-1 md:order-0">
        <Image
          src="/icons/logo-full.svg"
          alt="Logo"
          width={160}
          height={60}
          priority={true}
          className="hidden md:flex"
        />
        <div className="space-y-4">
          <h2 className="text-3xl">Manage your files in the best way</h2>
          <p className="text-xl">
            This is a place where you can store all your documents
          </p>
        </div>
        <Image src="/images/files.png" alt="" width={300} height={300} />
      </div>
      <div className="grid items-center justify-center auth">
        <Image
          src="/icons/logo-full.svg"
          alt="Logo"
          width={160}
          height={60}
          priority={true}
          className="md:hidden mx-auto"
        />
        {children}
      </div>
    </section>
  );
}
