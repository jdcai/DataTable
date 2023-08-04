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
import { defaultColumns } from "./Constants";
import { getColumnOrder } from "./utils/ColumnOrderUtils";
import styled from "styled-components";

const ButtonContainer = styled.div`
    display: flex;
    justify-items: center;
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
    };

    // Remove this
    const save = () => {
        if (columnOrder.join() !== getColumnOrder(defaultColumns).join()) {
            saveUserColumns(columnOrder.join());
            setMessage("Column order has been saved.");
        } else {
            setMessage("Columns are in default order and will not be saved.");
        }
    };

    const reload = () => {
        setColumnOrder(getColumnOrder(columns));
        reset();
    };

    useEffect(() => {
        setColumnOrder(getInitialColumnOrder());
    }, [loggedIn]);
    useEffect(() => {
        const callGetUsers = async () => {
            setIsLoading(true);
            const users = await getUsers();
            setData(users);
            setIsLoading(false);
        };

        callGetUsers();
    }, []);

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

    return (
        <>
            {isLoading && <CircularProgress size={60} />}
            {!isLoading && data.length > 0 && (
                <div>
                    <ButtonContainer>
                        {loggedIn && "Logged in"} {!loggedIn && <button onClick={login}>Login</button>}
                        {loggedIn && <button onClick={logout}>Logout</button>}
                        {loggedIn && <button onClick={save}>Save</button>}
                        {loggedIn && <button onClick={reload}>Reload</button>}
                    </ButtonContainer>
                    {message && <div>{message}</div>}
                    <DataTable table={table} />
                </div>
            )}
        </>
    );
}

export default App;
