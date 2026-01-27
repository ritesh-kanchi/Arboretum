import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Embed",
  description: "An embeded Arboretum view.",
};

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
