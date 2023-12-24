"use client";

import { type VisitListInput } from "@/server/api/routers/visit";
import { type SearchParams } from "@/types";
import { api } from "@/trpc/react";
import { Table } from "antd";
import { createUrl, formatDateLong, formatTime, textEllipsis } from "@/lib/utils";
import { redirect, useRouter, useSearchParams } from "next/navigation";

type Props = {
  searchParams: SearchParams;
};

export default function DashboardPage({ searchParams }: Props) {
  const router = useRouter();
  const newSearchParams = useSearchParams();
  const newParams = new URLSearchParams(newSearchParams.toString());

  const query: VisitListInput = {
    pagination: {
      limit: Number(searchParams.limit) || 1,
      page: Number(searchParams.page) || 1,
    },
    params: {},
  };

  const { data, isLoading: loading } = api.visit.list.useQuery(query);

  if (data?.isInvalidPage) {
    newParams.delete("page");
    redirect(createUrl("/dashboard", newParams));
  }

  return (
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
          render: (_, __, index) => index + 1,
        },
        {
          title: "Nama",
          key: "visitorName",
          dataIndex: "visitorName",
        },
        {
          title: "Perusahaan",
          key: "visitorCompany",
          dataIndex: "visitorCompany",
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
        },
        {
          title: "Tanggal",
          key: "startTime",
          dataIndex: "startTime",
          render: (text: Date) => formatDateLong(text),
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
  );
}
