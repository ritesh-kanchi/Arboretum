import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Preview",
  description: "An Arboretum view in preview mode.",
};

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
