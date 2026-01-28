import { ChevronDown } from "lucide-react";
import { useEffect, useState } from "react";

export type TableColumn<T> = {
    label: string,
    key: keyof T,
    notSortable?: boolean,
    render?(data: T): React.ReactNode,
    sort?(a: T[keyof T], b: T[keyof T]): number,
};

export default function Table<T extends Record<string, any>>({ columns, data, sort, sortType }:
    { columns: TableColumn<T>[], data: T[], sort?: keyof T, sortType?: "asc" | "desc" }) {
    const [tableData, setTableData] = useState([...data]);

    const [sortKey, setSortKey] = useState<keyof T>("");
    const [sortDir, setSortDir] = useState<"asc" | "desc">(sortType ?? "desc");

    function handleSort(key: keyof T, setDir?: "asc" | "desc") {
        const col = columns.find(c => c.key === key);

        if (!col)
            return;

        if (col.notSortable)
            return;

        let newSortDir = sortDir;

        if (sortKey === key) {
            newSortDir = sortDir === "asc" ? "desc" : "asc";
        } else {
            setSortKey(key);
            newSortDir = setDir ?? "desc";
        }

        const sortedData = [...tableData].sort((a, b) => {
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
        handleSort(sort ?? columns.filter(c => !c.notSortable)[0]?.key ?? "", sortType);
    }, []);

    return (
        <table className="w-full bg-bg-light rounded-lg overflow-x-scroll md:overflow-hidden">
            <thead>
                <tr>
                    {columns.map(c => <th
                        className={`text-left pl-4 pr-3 p-2 ${!c.notSortable && "hover:bg-bg-lighter"} transition-colors`}
                        key={c.key as string}
                    >
                        <div
                            className={`flex justify-between items-center ${!c.notSortable && "cursor-pointer"}`}
                            onClick={() => handleSort(c.key)}
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
                    className="border-t-2 border-bg-lighter cursor-pointer hover:bg-bg-lighter transition-colors"
                    key={i}
                >
                    {columns.map(col => <td
                        className="px-4 py-2"
                        key={col.key as string}
                    >
                        {col.render && col.render(item)}
                        {!col.render && item[col.key]}
                    </td>)}
                </tr>)}
            </tbody>
        </table>
    );
}
