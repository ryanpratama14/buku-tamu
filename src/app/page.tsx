"use client";

import Image from "next/image";
import logo from "@/assets/logo.png";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const [count, setCount] = useState(0);
  const router = useRouter();
  return (
    <article className="flex justify-center items-center bg-blue min-h-screen flex-col gap-12 text-light">
      <Image
        onClick={() => {
          setCount((prev) => prev + 1);
          if (count === 7) router.push("/signin");
        }}
        src={logo}
        alt="Buku Tamu | PT Abimanyu Sekar Nusantara"
        className="w-96 aspect-auto"
      />

      <h2 className="flex flex-col justify-center items-center gap-4">
        <span className="font-semibold">Buku Tamu</span>
        <div className="w-[130%] h-0.5 bg-light" />
      </h2>
      <section className="flex flex-col gap-6">
        <h4 className="font-semibold">
          Selamat Datang Di
          <br />
          PT Abimanyu Sekar Nusantara
        </h4>
        <h6>Silakan mengisi identitas Anda di sini</h6>
      </section>
      <Link href="/create-visit" className="font-medium px-24 py-3 bg-green rounded-full text-lg">
        Mulai
      </Link>
    </article>
  );
}
