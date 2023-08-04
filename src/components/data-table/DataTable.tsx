import { User } from "../../types/User";
import { Table, flexRender } from "@tanstack/react-table";
import DraggableColumnHeader from "./DraggableColumnHeader";

interface DataTableProps {
    table: Table<User>;
}

const DataTable = ({ table }: DataTableProps) => {
    return (
        <table>
            <thead>
                {table.getHeaderGroups().map((headerGroup) => (
                    <tr key={headerGroup.id}>
                        {headerGroup.headers.map((header) => (
                            <DraggableColumnHeader key={header.id} header={header} table={table} />
                        ))}
                    </tr>
                ))}
            </thead>
            <tbody>
                {table.getRowModel().rows.map((row) => (
                    <tr key={row.id}>
                        {row.getVisibleCells().map((cell) => (
                            <td key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>
                        ))}
                    </tr>
                ))}
            </tbody>
        </table>
    );
};

export default DataTable;
