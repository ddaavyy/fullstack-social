import type { PropsWithChildren } from "react";

import usePageTitle from "@/hooks/usePageTitle";

type PageProps = PropsWithChildren<{
  title: string;
}>;

export default function Page({ title, children }: PageProps) {
  usePageTitle(title);
  return <>{children}</>;
}
