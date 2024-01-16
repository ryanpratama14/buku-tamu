import "@/styles/globals.css";
import { Poppins } from "next/font/google";
import { cookies } from "next/headers";
import { TRPCReactProvider } from "@/trpc/react";
import AntdProvider from "@/components/AntdProvider";
import HigherOrderComponent from "@/global/HigherOrderComponent";
import { getServerAuthSession } from "@/server/auth";

const poppins = Poppins({
  subsets: ["latin"],
  variable: "--font-poppins",
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

export const metadata = {
  title: "Buku Tamu | PT Abimanyu Sekar Nusantara",
  description: "Generated by create-t3-app",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
  manifest: "/manifest.json",
};

type Props = { children: React.ReactNode };

export default async function RootLayout({ children }: Props) {
  const session = await getServerAuthSession();

  return (
    <html lang="en" className={poppins.variable}>
      <body className="font-poppins">
        <HigherOrderComponent session={session}>
          <TRPCReactProvider cookies={cookies().toString()}>
            <AntdProvider>
              <main>{children}</main>
            </AntdProvider>
          </TRPCReactProvider>
        </HigherOrderComponent>
      </body>
    </html>
  );
}
