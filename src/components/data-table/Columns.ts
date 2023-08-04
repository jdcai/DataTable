import { ColumnDef } from "@tanstack/react-table";
import { User } from "../../types/User";
import moment from "moment";

const getDaysSince = (date: Date) => {
    const now = moment();
    const daysDiff = now.diff(date, "days");
    return daysDiff;
};

export const defaultColumns: ColumnDef<User>[] = [
    {
        id: "id",
        header: "ID",
        accessorKey: "id",
        sortDescFirst: false,
    },

    {
        id: "fullName",
        header: "Full Name",
        accessorFn: (row) => `${row.firstName} ${row.lastName}`,
        sortDescFirst: false,
    },
    {
        id: "firstName",
        header: "First Name",
        accessorKey: "firstName",
        sortDescFirst: false,
    },
    {
        id: "lastName",
        header: "Last Name",
        accessorKey: "lastName",
        sortDescFirst: false,
    },

    {
        id: "email",
        header: "Email",
        accessorKey: "email",
        sortDescFirst: false,
    },
    {
        id: "city",
        header: "City",
        accessorKey: "city",
        sortDescFirst: false,
    },
    {
        id: "registeredDate",
        header: "Registered Date",
        accessorKey: "registeredDate",
        cell: (props) => props.row.original.registeredDate.toLocaleDateString(),
        sortingFn: "datetime",
        sortDescFirst: false,
    },
    {
        id: "daysSinceRegistered",
        header: "Days Since Registered",
        accessorFn: (row) => getDaysSince(row.registeredDate),
        sortDescFirst: false,
    },
];
