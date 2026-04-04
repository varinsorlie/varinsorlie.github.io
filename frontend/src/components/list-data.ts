export interface ListItem {
  name: string;
  address: string;
  description: string;
  detail?: string;
  personalNote?: string;
  meta?: Record<string, string>;
}

export interface TableColumn {
  key: string;
  label: string;
  emoji: string;
}

export interface ListData {
  slug: string;
  title: string;
  subtitle: string;
  emoji: string;
  color: string;
  image: string;
  story: string;
  closingNote: string;
  tableColumns: TableColumn[];
  items: ListItem[];
}

export const allLists: ListData[] = [

];
