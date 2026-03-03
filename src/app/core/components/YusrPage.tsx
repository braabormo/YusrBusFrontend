import type { PropsWithChildren } from "react";
import type { CardProps } from "./table/tableCard";

type YusrPageProps = PropsWithChildren & {
  title: string;
  buttonTitle: string;
  cards: CardProps[];
};
export default function YusrPage({ children }: YusrPageProps) {
  return <></>;
}
