"use client";

import Image from "next/image";
import logo from "@/assets/logo.png";
import { Fragment, useState } from "react";
import { cn } from "@/lib/utils";
import { type ChangeEvent, type FormEvent } from "@/types";
import { type Visit, type VisitCreateInput } from "@/server/api/routers/visit";
import { api } from "@/trpc/react";
import ModalVisitCreated from "@/components/ModalVisitCreated";
import { useRouter } from "next/navigation";

const visitingOptions = [
  {
    label: "Berkunjung sekarang",
    value: true,
  },
  {
    label: "Berkunjung nanti",
    value: false,
  },
];

export default function CreateVisitPage() {
  const [isVisitingNow, setIsVisitingNow] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const router = useRouter();
  const [data, setData] = useState<VisitCreateInput>({
    visitorName: "",
    visitorCompany: "",
    description: "",
    phoneNumber: "",
    startTime: "",
    startDate: "",
  });
  const [newData, setNewData] = useState<Visit | null>(null);

  const handleChange = (name: keyof VisitCreateInput) => (e: ChangeEvent) => {
    setData({ ...data, [name]: e.target.value });
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    createVisit(data);
  };

  const { mutate: createVisit, isLoading } = api.visit.create.useMutation({
    onSuccess: (res) => {
      setShowModal(true);
      setNewData(res);
    },
  });

  return (
    <Fragment>
      <ModalVisitCreated
        show={showModal}
        closeModal={() => {
          setShowModal(false);
          router.push("/");
        }}
        data={newData}
      />
      <form
        onSubmit={handleSubmit}
        className="flex justify-center items-center gap-12 flex-col bg-blue min-h-screen p-shorter 2xl:px-[36rem]"
      >
        <Image src={logo} alt="Buku Tamu | PT Abimanyu Sekar Nusantara" className="w-96 aspect-auto" />
        <h4 className="flex flex-col justify-center items-center gap-4 text-light">
          <span className="font-semibold">Buku Tamu</span>
          <div className="w-[130%] h-0.5 bg-light" />
        </h4>
        <section className="flex flex-col divide-y divide-black w-full">
          <label htmlFor="visitorName" className="text-center bg-light2 rounded-t-2xl">
            Nama
          </label>
          <section className="bg-light2 rounded-b-2xl">
            <input
              required
              value={data.visitorName}
              id="visitorName"
              onChange={handleChange("visitorName")}
              className="bg-light py-4 text-center rounded-b-2xl w-full"
            />
          </section>
        </section>
        <section className="flex flex-col divide-y divide-black w-full">
          <label htmlFor="visitorCompany" className="text-center bg-light2 rounded-t-2xl">
            Perusahaan
          </label>
          <section className="bg-light2 rounded-b-2xl">
            <input
              required
              value={data.visitorCompany}
              id="visitorCompany"
              onChange={handleChange("visitorCompany")}
              className="bg-light py-4 text-center rounded-b-2xl w-full"
            />
          </section>
        </section>
        <section className="flex flex-col divide-y divide-black w-full">
          <label id="phoneNumber" className="text-center bg-light2 rounded-t-2xl">
            Nomor Telp.
          </label>
          <section className="bg-light2 rounded-b-2xl">
            <input
              required
              id="phoneNumber"
              value={data.phoneNumber}
              onChange={handleChange("phoneNumber")}
              placeholder="0899999999999"
              className="bg-light py-4 text-center rounded-b-2xl w-full"
            />
          </section>
        </section>
        <section className="flex flex-col gap-2 items-end w-full">
          <section className="flex flex-col gap-2 text-light">
            {visitingOptions.map((option) => {
              const checked = isVisitingNow === option.value;
              return (
                <section key={option.label} className="flex gap-2">
                  <button
                    type="button"
                    className={cn("relative rounded-full bg-light w-6 aspect-square border-1 border-black", {
                      "bg-black": checked,
                    })}
                    onClick={() => setIsVisitingNow(option.value)}
                  >
                    <div
                      className={`animate absolute centered w-[40%] aspect-square rounded-full bg-light ${
                        !checked && "scale-0"
                      }`}
                    />
                  </button>
                  <p>{option.label}</p>
                </section>
              );
            })}
          </section>
        </section>
        {isVisitingNow ? null : (
          <Fragment>
            <section className="flex flex-col divide-y divide-black w-full">
              <label htmlFor="startDate" className="text-center bg-light2 rounded-t-2xl">
                Tanggal Berkunjung
              </label>
              <section className="bg-light2 rounded-b-2xl">
                <input
                  required={isVisitingNow}
                  value={data.startDate}
                  id="startDate"
                  onChange={handleChange("startDate")}
                  type="date"
                  className="bg-light py-4 text-center rounded-b-2xl w-full"
                />
              </section>
            </section>
            <section className="flex flex-col divide-y divide-black w-full">
              <label htmlFor="startTime" className="text-center bg-light2 rounded-t-2xl">
                Jam Berkunjung
              </label>
              <section className="bg-light2 rounded-b-2xl">
                <input
                  value={data.startTime}
                  required={isVisitingNow}
                  id="startTime"
                  onChange={handleChange("startTime")}
                  type="time"
                  className="bg-light py-4 text-center rounded-b-2xl w-full"
                />
              </section>
            </section>
          </Fragment>
        )}
        <section className="flex flex-col divide-y divide-black w-full">
          <label htmlFor="description" className="text-center bg-light2 rounded-t-2xl">
            Keperluan
          </label>
          <section className="bg-light2 rounded-b-2xl">
            <textarea
              id="description"
              required
              value={data.description}
              onChange={(e) => setData({ ...data, description: e.target.value })}
              rows={4}
              className="bg-light py-4 text-center rounded-b-2xl w-full"
            />
          </section>
        </section>
        <button disabled={isLoading} className="bg-green rounded-md shadow px-12 py-3 text-light" type="submit">
          {isLoading ? "Loading..." : "Simpan"}
        </button>
      </form>
    </Fragment>
  );
}
