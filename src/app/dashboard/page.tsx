"use client";

import { type VisitListInputParams, type VisitListInput } from "@/server/api/routers/visit";
import { type SearchParams } from "@/types";
import { api } from "@/trpc/react";
import { Table } from "antd";
import { cn, createUrl, formatDateLong, formatTime, textEllipsis } from "@/lib/utils";
import { redirect, useRouter, useSearchParams } from "next/navigation";
import Iconify from "@/components/Iconify";
import { ICONS, STATUS } from "@/lib/constants";
import { type FilterDropdownProps } from "antd/es/table/interface";
import { type Status } from "@prisma/client";
import { useState } from "react";
import { Workbook } from "exceljs";

type Props = {
  searchParams: SearchParams;
};

export default function DashboardPage({ searchParams }: Props) {
  const router = useRouter();
  const newSearchParams = useSearchParams();
  const newParams = new URLSearchParams(newSearchParams.toString());
  const [selectedStatus, setSelectedStatus] = useState<Status | undefined>(searchParams?.status as Status);

  const query: VisitListInput = {
    pagination: {
      limit: Number(searchParams.limit) || 30,
      page: Number(searchParams.page) || 1,
    },
    params: {
      visitorCompany: searchParams?.visitorCompany as string,
      visitorName: searchParams?.visitorName as string,
      status: searchParams?.status as Status,
      startTime: searchParams?.startTime as string,
    },
  };

  const { data, isLoading: loading } = api.visit.list.useQuery(query);

  const getTableFilter = (name: keyof VisitListInputParams) => ({
    filterDropdown: ({ confirm }: FilterDropdownProps) => {
      return (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const val = e.target as HTMLFormElement;
            const value = val[name] as HTMLInputElement;
            if (value.value) {
              newParams.set(name, value.value);
            } else newParams.delete(name);
            confirm();
            router.push(createUrl("/dashboard", newParams));
          }}
          className="flex flex-col gap-2 w-52 bg-light p-2 rounded-md shadow"
        >
          {name === "status" ? (
            <select
              value={selectedStatus}
              name={name}
              key={name}
              className="px-2 py-1 rounded-md border-1 border-black/50"
              onChange={(e) => setSelectedStatus(e.target.value as Status)}
            >
              <option value={undefined}>Select Status</option>
              <option value="DRAFT">DRAFT</option>
              <option value="VISITING">VISITING</option>
              <option value="DONE">DONE</option>
            </select>
          ) : name === "startTime" ? (
            <input
              className="px-2 py-1 rounded-md border-1 border-black/50"
              name={name}
              type="date"
              key={name}
              defaultValue={searchParams[name]}
            />
          ) : (
            <input
              className="px-2 py-1 rounded-md border-1 border-black/50"
              name={name}
              key={name}
              defaultValue={searchParams[name]}
            />
          )}
          <section className="grid grid-cols-2 gap-2">
            <button className="bg-green text-white rounded-md" type="submit">
              Search
            </button>
            <button
              type="button"
              className="bg-blue text-white rounded-md"
              onClick={(e) => {
                const form = e.currentTarget.form!;
                if (form) {
                  form.reset();
                  if (!searchParams[name]) return;
                }
                newParams.delete("page");
                newParams.delete(name);
                if (selectedStatus) setSelectedStatus(undefined);
                confirm();
                router.push(createUrl("/dashboard", newParams));
              }}
            >
              Reset
            </button>
          </section>
        </form>
      );
    },
    filterIcon: () => (
      <section
        className={cn("aspect-square w-7 text-light hover:text-black hover:bg-light relative rounded-full hover:shadow-lg animate", {
          "bg-light text-black": Object.keys(searchParams).includes(name),
        })}
      >
        <Iconify icon={ICONS.search} width={22} className="absolute centered" />
      </section>
    ),
  });

  if (data?.isInvalidPage) {
    newParams.delete("page");
    redirect(createUrl("/dashboard", newParams));
  }

  const renderExcel = async () => {
    if (data?.data?.length) {
      const workbook = new Workbook();
      const worksheet = workbook.addWorksheet();

      const columns = [
        { header: "Nama", key: "visitorName", width: 20 },
        { header: "Perusahaan", key: "visitorCompany", width: 20 },
        { header: "Keperluan", key: "description", width: 30 },
        { header: "Status", key: "status" },
        { header: "Tanggal", key: "startTime", width: 20 },
        { header: "Waktu Mulai", key: "startTime2", width: 15 },
        { header: "Waktu Selesai", key: "endTime", width: 15 },
      ];

      worksheet.columns = columns;

      for (let i = 0; i < columns.length; i++) {
        const cellAddress = String.fromCharCode(65 + i) + "1"; // 'A' corresponds to 65 in ASCII
        worksheet.getCell(cellAddress).font = { size: 12 };
        worksheet.getCell(cellAddress).fill = {
          type: "pattern",
          pattern: "gray125",
        };
        worksheet.getCell(cellAddress).border = {
          top: { style: "thin", color: { argb: "000000" } },
          left: { style: "thin", color: { argb: "000000" } },
          bottom: { style: "thin", color: { argb: "000000" } },
          right: { style: "thin", color: { argb: "000000" } },
        };
      }

      if (data?.data?.length) {
        data?.data?.forEach((item) => {
          worksheet.addRow({
            ...item,
            description: textEllipsis(item.description, 24),
            startTime: formatDateLong(item.startTime),
            startTime2: formatTime(item.startTime),
            endTime: item?.endTime ? formatTime(item.endTime) : "-",
          });
        });
      }

      const startData = 1;

      for (let j = 0; j < data.data.length + 1; j++) {
        for (let i = 0; i < columns.length; i++) {
          const cellAddress = String.fromCharCode(65 + i) + (startData + j);
          const cell = worksheet.getCell(cellAddress);
          cell.font = { size: 12 };
          cell.border = {
            top: { style: "thin", color: { argb: "000000" } },
            left: { style: "thin", color: { argb: "000000" } },
            bottom: { style: "thin", color: { argb: "000000" } },
            right: { style: "thin", color: { argb: "000000" } },
          };
        }
      }

      const blob = await workbook.xlsx.writeBuffer();
      const link = document.createElement("a");
      link.href = URL.createObjectURL(new Blob([blob]));
      link.download = `LAPORAN.xlsx`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <section className="flex flex-col gap-4">
      <section className="flex gap-4 items-end">
        <section className="flex flex-col gap-1">
          <label className="text-lg">Limit</label>
          <select
            value={searchParams.limit}
            name="limit"
            key="limit"
            className="text-center px-2 py-1 w-fit rounded-md border-1 border-black/50"
            onChange={(e) => {
              newParams.set("limit", e.target.value);
              router.push(createUrl("/dashboard", newParams));
            }}
          >
            <option value="30">30</option>
            <option value="50">50</option>
            <option value="100">100</option>
          </select>
        </section>
        <button
          type="button"
          onClick={renderExcel}
          className="bg-gray py-0.5 px-2 rounded-md text-white flex gap-1 items-center text-lg"
        >
          <Iconify width={25} icon="mdi:export" /> Export
        </button>
      </section>
      <Table
        onChange={(pagination) => {
          if (pagination.current === 1) {
            newParams.delete("page");
          } else newParams.set("page", String(pagination.current));
          router.push(createUrl("/dashboard", newParams));
        }}
        pagination={{
          current: data?.page,
          pageSize: data?.limit,
          total: data?.totalData,
        }}
        scroll={{ x: "max-content" }}
        rowKey="id"
        loading={loading}
        dataSource={data?.data}
        columns={[
          {
            title: "No",
            key: "no",
            dataIndex: "no",
            width: 1,
            align: "center",
            render: (_, __, index) => index + 1,
          },
          {
            title: "Nama",
            key: "visitorName",
            dataIndex: "visitorName",
            ...getTableFilter("visitorName"),
          },
          {
            title: "Perusahaan",
            key: "visitorCompany",
            dataIndex: "visitorCompany",
            ...getTableFilter("visitorCompany"),
          },
          {
            title: "Keperluan",
            key: "description",
            dataIndex: "description",
            render: (text: string) => textEllipsis(text, 24),
          },
          {
            title: "Status",
            key: "status",
            dataIndex: "status",
            render: (text: Status) => {
              return <p className={`px-4 shadow py-1 w-fit text-light rounded-xl ${STATUS[text]}`}>{text}</p>;
            },
            ...getTableFilter("status"),
          },
          {
            title: "Tanggal",
            key: "startTime",
            dataIndex: "startTime",
            render: (text: Date) => formatDateLong(text),
            ...getTableFilter("startTime"),
          },
          {
            title: "Waktu Mulai",
            key: "startTime",
            dataIndex: "startTime",
            render: (text: Date) => formatTime(text),
          },
          {
            title: "Waktu Selesai",
            key: "endTime",
            dataIndex: "endTime",
            render: (text: Date) => (text ? formatTime(text) : "-"),
          },
        ]}
      />
    </section>
  );
}
