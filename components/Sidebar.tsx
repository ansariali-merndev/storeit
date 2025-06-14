"use client";

import { navItems } from "@/constant";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { SignOut } from "./SignOut";

export default function Sidebar({
  fullName,
  email,
  avatar,
}: {
  fullName: string;
  email: string;
  avatar: string;
}) {
  const pathname = usePathname();

  return (
    <aside className="w-fit h-screen px-4 py-2 flex flex-col gap-12 bg-zinc-100">
      <Link href={"/"} className="p-2">
        <Image
          src="/icons/logo-full-brand.svg"
          alt="logo"
          height={200}
          width={200}
          priority={true}
          className="h-auto hidden lg:flex"
        />

        <Image
          src="/icons/logo-brand.svg"
          alt="logo"
          height={50}
          width={50}
          priority={true}
          className="lg:hidden"
        />
      </Link>

      <ul className="flex flex-col mx-auto space-y-8">
        {navItems.map(({ name, icon, url }, index) => (
          <li
            key={index}
            className={`px-4 py-2 rounded-lg transition-all duration-300 ${
              pathname === url ? "bg-zinc-300" : ""
            }`}
          >
            <Link href={url} className="flex gap-4">
              <Image
                src={icon}
                alt="hello"
                height={28}
                width={28}
                priority={true}
                className="w-6 filter invert opacity-25"
              />
              <p className="hidden lg:block">{name}</p>
            </Link>
          </li>
        ))}
      </ul>
      <div className="flex flex-col gap-2 justify-end items-center lg:items-start">
        <img
          src={avatar}
          alt=""
          className="w-8 h-8 rounded-full cursor-pointer"
        />
        <div className="text-xs hidden lg:block">
          <p>{fullName}</p>
          <p>{email}</p>
        </div>
      </div>
    </aside>
  );
}
