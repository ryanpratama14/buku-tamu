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
import { type Visit, type Status } from "@prisma/client";
import { Fragment, useState } from "react";
import ModalDelete from "@/components/ModalDelete";
import ModalConfirm from "@/components/ModalConfirm";

type Props = {
  searchParams: SearchParams;
};

export default function DashboardPage({ searchParams }: Props) {
  const router = useRouter();
  const newSearchParams = useSearchParams();
  const newParams = new URLSearchParams(newSearchParams.toString());
  const [selectedStatus, setSelectedStatus] = useState<Status | undefined>(searchParams?.status as Status);
  const [modalConfirm, setModalConfirm] = useState(false);
  const [modalDelete, setModalDelete] = useState(false);
  const [selectedData, setSelectedData] = useState<Visit | null>(null);

  const query: VisitListInput = {
    pagination: {
      limit: Number(searchParams.limit) || 30,
      page: Number(searchParams.page) || 1,
    },
    params: {
      visitorCompany: searchParams?.visitorCompany as string,
      visitorName: searchParams?.visitorName as string,
      status: "VISITING",
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
            router.push(createUrl("/dashboard/data/ongoing", newParams));
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
                router.push(createUrl("/dashboard/data/ongoing", newParams));
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
        className={cn(
          "aspect-square w-7 text-light hover:text-black hover:bg-light relative rounded-full hover:shadow-lg animate",
          {
            "bg-light text-black": Object.keys(searchParams).includes(name),
          }
        )}
      >
        <Iconify icon={ICONS.search} width={22} className="absolute centered" />
      </section>
    ),
  });

  if (data?.isInvalidPage) {
    newParams.delete("page");
    redirect(createUrl("/dashboard/data/ongoing", newParams));
  }

  return (
    <Fragment>
      <ModalConfirm
        title="Konfirmasi Kunjungan Selesai"
        show={modalConfirm}
        closeModal={() => setModalConfirm(false)}
        data={selectedData}
        status="DONE"
      />
      <ModalDelete show={modalDelete} closeModal={() => setModalDelete(false)} data={selectedData} />
      <section className="flex flex-col gap-4">
        <section className="flex flex-col gap-1">
          <label className="text-lg">Limit</label>
          <select
            value={searchParams.limit}
            name="limit"
            key="limit"
            className="text-center px-2 py-1 w-fit rounded-md border-1 border-black/50"
            onChange={(e) => {
              newParams.set("limit", e.target.value);
              router.push(createUrl("/dashboard/data/ongoing", newParams));
            }}
          >
            <option value="30">30</option>
            <option value="50">50</option>
            <option value="100">100</option>
          </select>
        </section>
        <Table
          onChange={(pagination) => {
            if (pagination.current === 1) {
              newParams.delete("page");
            } else newParams.set("page", String(pagination.current));
            router.push(createUrl("/dashboard/data/ongoing", newParams));
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
              title: "Aksi",
              key: "aksi",
              dataIndex: "aksi",
              width: 1,
              align: "center",
              fixed: "left",
              render: (_, item) => {
                return (
                  <section className="flex gap-2 items-center justify-center">
                    <Iconify
                      onClick={() => {
                        setModalDelete(true);
                        setSelectedData(item);
                      }}
                      icon="mdi:delete"
                      width={25}
                      className="p-1 bg-red-600 text-light rounded-md"
                    />
                    <Iconify
                      onClick={() => {
                        setModalConfirm(true);
                        setSelectedData(item);
                      }}
                      icon="mdi:check"
                      width={25}
                      className="p-1 bg-green text-light rounded-md"
                    />
                  </section>
                );
              },
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
    </Fragment>
  );
}
