import { ChevronDown } from "lucide-react";
import { useEffect, useState } from "react";

export type TableColumn<T> = {
    label: React.ReactNode,
    key?: keyof T,
    notSortable?: boolean,
    render?(row: T): React.ReactNode,
    sort?(a: T[keyof T], b: T[keyof T]): number,
};

type Props<T> = {
    columns: (TableColumn<T> | null)[];
    data: T[];
    sort?: keyof T;
    sortType?: "asc" | "desc";
    rowClassName?: string;
    onRowClick?: (row: T) => void;
};

export function EmptyCell() {
    return <div className="w-12 h-0.5 bg-bg-lightest" />;
}

export default function Table<T extends Record<string, any>>({ columns, data, sort, sortType, rowClassName, onRowClick }: Props<T>) {
    const [tableData, setTableData] = useState([...data]);

    const [sortKey, setSortKey] = useState<keyof T>("");
    const [sortDir, setSortDir] = useState<"asc" | "desc">(sortType ?? "desc");

    function handleSort(key: keyof T, setDir?: "asc" | "desc") {
        const col = columns.find(c => c?.key === key);

        if (!col)
            return;

        if (col.notSortable)
            return;

        let newSortDir = sortDir;

        if (setDir)
            newSortDir = setDir;

        setSortKey(key);

        const sortedData = [...data].sort((a, b) => {
            const valA = newSortDir === "asc" ? b[key] : a[key];
            const valB = newSortDir === "desc" ? b[key] : a[key];

            if (col.sort)
                return col.sort(valA, valB);

            if (typeof valA === "string")
                return (valA as string).localeCompare(valB);
            if (typeof valA === "number")
                return valA - valB;

            return 0;
        });

        setSortDir(newSortDir);
        setTableData(sortedData);
    }

    useEffect(() => {
        handleSort(sort ?? columns.filter(c => !c?.notSortable)[0]?.key ?? "", sortType);
    }, [data]);

    return (
        <table className="w-full bg-bg-light rounded-lg overflow-x-scroll md:overflow-hidden">
            <thead>
                <tr>
                    {columns.filter(c => !!c).map(c => <th
                        className={`text-left pl-4 pr-3 p-2 ${!c.notSortable && "hover:bg-bg-lighter"} transition-colors`}
                        key={c.key as string}
                    >
                        <div
                            className={`flex justify-between items-center ${!c.notSortable && "cursor-pointer"}`}
                            onClick={() => c.key &&
                                handleSort(c.key, sortKey === c.key ? (sortDir === "asc" ? "desc" : "asc") : undefined)}
                        >
                            {c.label}
                            <ChevronDown
                                className={`${sortDir === "asc" && "rotate-180"} ${sortKey !== c.key && "opacity-0"} text-gray-400
                                    transition-all`}
                            />
                        </div>
                    </th>)}
                </tr>
            </thead>
            <tbody>
                {tableData.map((item, i) => <tr
                    className={`border-t-2 border-bg-lighter ${rowClassName}`}
                    key={i}
                    onClick={() => onRowClick?.(item)}
                >
                    {columns.filter(c => !!c).map(col => <td
                        className="px-4 py-2"
                        key={col.key as string}
                    >
                        {col.render && col.render(item)}
                        {(!col.render && col.key && !item[col.key]) && <EmptyCell />}
                        {!col.render && col.key && item[col.key]}
                    </td>)}
                </tr>)}
            </tbody>
        </table>
    );
}
