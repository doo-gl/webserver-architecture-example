

export interface BaseTable {
  id:string,
  date_created:Date,
  date_last_modified:Date,
}

export type Create<T extends BaseTable> = Omit<T, keyof BaseTable>
export type Update<T extends BaseTable> = Partial<Create<T>>