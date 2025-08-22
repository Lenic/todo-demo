export interface ICreatedItem {
  createdBy: string;
  updatedBy: string;
}

export interface IItem extends ICreatedItem {
  createdAt: number;
  updatedAt: number;
}
