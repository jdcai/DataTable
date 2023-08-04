import { useEffect, useState } from "react";
import { User } from "./types/User";
import {
    ColumnOrderState,
    getCoreRowModel,
    getSortedRowModel,
    SortingState,
    useReactTable,
} from "@tanstack/react-table";
import { getUsers, loginUser, logoutUser, saveUserColumns } from "./services/UserService";
import { CircularProgress } from "@mui/material";
import DataTable from "./components/data-table/DataTable";
import { defaultColumns } from "./components/data-table/Columns";
import { getColumnOrder } from "./utils/ColumnOrderUtils";
import styled from "styled-components";

const ButtonSectionContainer = styled.div`
    margin-bottom: 8px;
    height: 48px;
`;
const ButtonContainer = styled.div`
    display: flex;
    justify-content: center;
    column-gap: 8px;
`;

function App() {
    const getInitialColumnOrder = () => {
        if (loggedIn) {
            const savedColumns = localStorage.getItem("columns")?.split(",");
            if (savedColumns) {
                return savedColumns;
            }
        }
        return getColumnOrder(columns);
    };

    const [loggedIn, setLoggedIn] = useState(localStorage.getItem("loggedIn") === "true");
    const [columns] = useState([...defaultColumns]);
    const [columnOrder, setColumnOrder] = useState<ColumnOrderState>(getInitialColumnOrder());
    const [sorting, setSorting] = useState<SortingState>([]);
    const [data, setData] = useState<User[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState("");

    const table = useReactTable({
        data,
        columns,
        state: {
            columnOrder,
            sorting,
        },
        onSortingChange: setSorting,
        onColumnOrderChange: setColumnOrder,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
    });

    const login = () => {
        loginUser();
        setLoggedIn(true);
        reset();
    };

    const logout = () => {
        logoutUser();
        setLoggedIn(false);
        reset();
    };

    const reset = () => {
        setMessage("");
        table.resetSorting();
    };

    const save = () => {
        saveUserColumns(columnOrder.join());
        setMessage("Column order has been saved.");
    };

    const reload = () => {
        setColumnOrder(getColumnOrder(columns));
        reset();
    };

    useEffect(() => {
        const callGetUsers = async () => {
            setIsLoading(true);
            const users = await getUsers();
            setData(users);
            setIsLoading(false);
        };

        callGetUsers();
    }, []);

    useEffect(() => {
        setColumnOrder(getInitialColumnOrder());
    }, [loggedIn]);

    return (
        <>
            {isLoading && <CircularProgress size={60} />}
            {!isLoading && data.length > 0 && (
                <>
                    <ButtonSectionContainer>
                        <ButtonContainer>
                            {loggedIn && "Logged in"} {!loggedIn && <button onClick={login}>Login</button>}
                            {loggedIn && <button onClick={logout}>Logout</button>}
                            {loggedIn && <button onClick={save}>Save</button>}
                            {loggedIn && <button onClick={reload}>Reload</button>}
                        </ButtonContainer>
                        {message && <div>{message}</div>}
                    </ButtonSectionContainer>
                    <DataTable table={table} />
                </>
            )}
        </>
    );
}

export default App;
