import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Study",
  description: "An Arboretum view in study mode.",
};

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
