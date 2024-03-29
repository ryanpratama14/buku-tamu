"use client";

import { Layout, Menu, type MenuProps } from "antd";
import { usePathname, useRouter } from "next/navigation";
import { Fragment } from "react";
import { HomeOutlined, DatabaseOutlined } from "@ant-design/icons";
import { COLORS } from "@/styles/theme";
import Image from "next/image";
import logo from "@/assets/logo2.png";
import Iconify from "@/components/Iconify";
import { signOut } from "next-auth/react";
import { type Session } from "next-auth";

type Props = {
  children: React.ReactNode;
  session: Session;
};

type MenuItem = Required<MenuProps>["items"][number];

const items: MenuItem[] = [
  {
    key: "/dashboard",
    label: <p className="font-medium select-none">Dashboard</p>,
    icon: <HomeOutlined style={{ fontSize: "16px", color: COLORS.light }} />,
  },
  {
    key: "Data",
    label: <p className="font-medium select-none">Data Master</p>,
    icon: <DatabaseOutlined style={{ fontSize: "16px", color: COLORS.light }} />,
    children: [
      {
        key: "/dashboard/data/ongoing",
        label: <small className="select-none">Sedang Berkunjung</small>,
      },
      {
        key: "/dashboard/data/draft",
        label: <small className="select-none">Berkunjung Nanti</small>,
      },
    ],
  },
];

export default function DashboardMenu({ children, session }: Props) {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <Fragment>
      <Layout style={{ minHeight: "100vh" }}>
        <Layout.Sider width={225}>
          <section className="min-h-screen flex flex-col gap-6 justify-between pb-6">
            <section className="flex flex-col gap-6 py-12 text-light">
              <h6 className="text-center font-bold">BUKU TAMU</h6>
              <Menu
                color={COLORS.blue}
                onClick={(e) => {
                  router.push(e.key);
                }}
                defaultSelectedKeys={[pathname]}
                mode="inline"
                items={items}
              />
            </section>
            <button
              className="flex gap-2 w-full items-center text-light text-lg justify-center bg-red-600 py-2"
              type="button"
              onClick={() => signOut()}
            >
              <Iconify icon="mdi:logout" />
              Logout
            </button>
          </section>
        </Layout.Sider>
        <article className="p-6 w-full min-h-screen flex flex-col gap-6 bg-light">
          <section className="bg-white w-full p-6 shadow-lg flex h-fit rounded-md justify-between items-center">
            <Image src={logo} className="w-44 aspect-auto" alt="Buku Tamu | PT Abimanyu Sekar Nusantara" />
            <section className="flex flex-col gap-2">
              <p className="font-bold text-xl">Username: {session.user.name}</p>
              <p className="text-lg">sebagai {session.user.role === "SPV" ? "Supervisor" : "Admin"}</p>
            </section>
          </section>
          {children}
        </article>
      </Layout>
    </Fragment>
  );
}
