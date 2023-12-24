"use client";

import Image from "next/image";
import logo from "@/assets/logo2.png";
import { useState } from "react";
import { type Login } from "@/schema";
import Iconify from "@/components/Iconify";
import { type ChangeEvent, type FormEvent } from "@/types";
import { useMutation } from "@tanstack/react-query";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { notification } from "antd";

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(false);

  const [data, setData] = useState<Login>({
    username: "",
    password: "",
  });

  const handleChange = (name: keyof Login) => (e: ChangeEvent) => {
    setData({ ...data, [name]: e.target.value });
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    mutate(data);
  };

  const { mutate, isLoading } = useMutation({
    mutationFn: async (data: Login) => {
      if (error) setError(false);
      const res = await signIn("credentials", {
        username: data.username,
        password: data.password,
        redirect: false,
      });
      if (!res?.error) {
        notification.success({ message: "Berhasil masuk", duration: 3 });
        return router.push("/dashboard");
      }
      setError(true);
    },
  });

  return (
    <article className="flex justify-center items-center min-h-screen p-shorter bg-light z-0 relative overflow-hidden">
      <section className="xl:w-[30%] flex flex-col gap-6 w-full shadow rounded-md bg-white p-12 relative">
        <div className="absolute -right-44 -top-44 rounded-md w-56 aspect-square bg-none border-2 border-gray2/50 -z-10" />
        <div className="absolute -right-24 -top-24 rounded-md w-72 bg-[#F2F2F8] aspect-square bg-none -z-20 shadow" />
        <section className="flex flex-col justify-center items-center">
          <Image src={logo} alt="Buku Tamu | PT Abimanyu Sekar Nusantara" className="w-96 aspect-auto" />
        </section>
        <h5 className="text-gray font-semibold text-center">Buku Tamu</h5>
        <h6 className="text-gray2 font-medium">Sign In</h6>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <section className="flex flex-col gap-1">
            <label htmlFor="username" className="text-gray2">
              Username
            </label>
            <input
              required
              onChange={handleChange("username")}
              placeholder="username"
              value={data.username}
              className="px-4 py-2 rounded-xl border-2 border-gray2/50 placeholder:text-gray2/50"
            />
          </section>
          <section className="flex flex-col gap-1">
            <label htmlFor="password" className="text-gray2">
              Password
            </label>
            <section className="relative">
              <input
                required
                onChange={handleChange("password")}
                type={showPassword ? "text" : "password"}
                placeholder="*********"
                value={data.password}
                className="w-full px-4 py-2 rounded-xl border-2 border-gray2/50 placeholder:text-gray2/50"
              />
              <Iconify
                onClick={() => setShowPassword(!showPassword)}
                icon="mdi:eye"
                className="text-gray2/50 absolute centered-right -translate-x-4"
              />
            </section>
          </section>
          {error ? <p className="text-gray2 font-semibold">Username atau password yang Anda masukan salah</p> : null}
          <button
            disabled={isLoading}
            type="submit"
            className="py-3 text-semibold bg-purple text-white rounded-md shadow mt-4"
          >
            {isLoading ? "Loading..." : "Sign In"}
          </button>
        </form>
      </section>
    </article>
  );
}
