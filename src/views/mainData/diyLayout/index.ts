import { BaseDiyLayout } from "@/api/interface/player/baseDiyLayout";

export interface DrawerProps {
  title: string;
  isAdd: boolean;
  row: Partial<BaseDiyLayout.DiyLayout>;
}
