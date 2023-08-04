import { ColumnDef } from "@tanstack/react-table";
import { User } from "../types/User";

export const getColumnOrder = (columns: ColumnDef<User>[]): string[] => {
    return columns.map((column) => column.id as string);
};
