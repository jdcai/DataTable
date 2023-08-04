import { ColumnOrderState, Header, Table, Column, flexRender } from "@tanstack/react-table";
import { useRef } from "react";
import { useDrop, useDrag } from "react-dnd";
import { User } from "../../types/User";
import styled from "styled-components";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";

interface SortProps {
    $sortDirection: string | boolean;
}
const StyledArrow = styled(ArrowDownwardIcon)`
    opacity: ${(props: SortProps) => (props.$sortDirection === false ? 0 : 1)};
    transform: ${(props: SortProps) => (props.$sortDirection === "desc" ? "rotate(0deg)" : "rotate(180deg)")};
`;
const SortableHeaderSection = styled.div<SortProps>`
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    margin-left: 24px;

    &:hover ${StyledArrow} {
        opacity: ${(props: SortProps) => (props.$sortDirection === false ? 0.5 : 1)};
    }
`;

interface StyledTableHeaderProps {
    isDragging: boolean;
}

const StyledTableHeader = styled.th`
    opacity: ${(props: StyledTableHeaderProps) => (props.isDragging === true ? 0.5 : 1)};
    cursor: "move";
`;

interface DraggableColumnHeaderProps {
    header: Header<User, unknown>;
    table: Table<User>;
}

const reorderColumn = (draggedColumnId: string, targetColumnId: string, columnOrder: string[]): ColumnOrderState => {
    columnOrder.splice(
        columnOrder.indexOf(targetColumnId),
        0,
        columnOrder.splice(columnOrder.indexOf(draggedColumnId), 1)[0] as string,
    );
    return [...columnOrder];
};

const DraggableColumnHeader = ({ header, table }: DraggableColumnHeaderProps) => {
    const { getState, setColumnOrder } = table;
    const { columnOrder } = getState();
    const { column } = header;
    const ref = useRef(null);

    const [, dropRef] = useDrop({
        accept: "column",
        drop: (draggedColumn: Column<User>) => {
            const newColumnOrder = reorderColumn(draggedColumn.id, column.id, columnOrder);
            setColumnOrder(newColumnOrder);
        },
    });

    const [{ isDragging }, dragRef] = useDrag({
        collect: (monitor) => ({
            isDragging: monitor.isDragging(),
        }),
        item: () => column,
        type: "column",
    });

    dragRef(dropRef(ref));

    return (
        <StyledTableHeader ref={ref} colSpan={header.colSpan} isDragging={isDragging}>
            <SortableHeaderSection
                $sortDirection={header.column.getIsSorted()}
                onClick={header.column.getToggleSortingHandler()}
            >
                {flexRender(header.column.columnDef.header, header.getContext())}
                <StyledArrow $sortDirection={header.column.getIsSorted()} />
            </SortableHeaderSection>
        </StyledTableHeader>
    );
};

export default DraggableColumnHeader;
