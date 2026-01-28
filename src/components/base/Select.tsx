import React, { useState } from "react";
import { Dropdown, DropdownContent, DropdownItem, DropdownTrigger } from "./Dropdown";
import { ChevronDown } from "lucide-react";
import Subtext from "./Subtext";
import Input from "./Input";

export function Select({ options, value, onChange, placeholder, ...props }:
    { options: Record<string, React.ReactNode>, value: string, onChange: (val: string) => void, placeholder?: string } &
Omit<React.SelectHTMLAttributes<HTMLButtonElement>, "value" | "onChange" | "children">) {
    return (
        <Dropdown>
            <DropdownTrigger asChild>
                <button {...props} className={`px-2 py-1 pr-2 rounded-lg bg-bg-lighter border-2 outline-none drop-shadow-lg
                flex flex-row justify-between gap-4 items-center border-transparent focus:border-primary transition-all w-full
                cursor-pointer text-sm ${props.className ?? ""}`}>
                    {options[value] ?? <Subtext>{placeholder}</Subtext>}
                    <ChevronDown />
                </button>
            </DropdownTrigger>
            <DropdownContent>
                {Object.keys(options)
                    .map(k => <DropdownItem
                        onClick={() => onChange(k)}
                        className={`${value === k && "border-primary!"} border-2 border-transparent`}
                        key={k}
                    >
                        {options[k]}
                    </DropdownItem>)
                }
            </DropdownContent>
        </Dropdown>
    );
}

export function SelectMultiple({ options, values, onChange, placeholder, searchable, ...props }:
    { options: Record<string, React.ReactNode>, values: string[], onChange: (newVals: string[]) => void, placeholder?: string,
        searchable?: boolean } &
Omit<React.SelectHTMLAttributes<HTMLButtonElement>, "value" | "onChange" | "children">) {
    const [search, setSearch] = useState("");

    return (
        <Dropdown>
            <DropdownTrigger asChild>
                <button {...props} className={`px-2 py-1 pr-2 rounded-lg bg-bg-lighter border-2 outline-none drop-shadow-lg
                flex flex-row justify-between gap-4 items-center border-transparent focus:border-primary transition-all 
                cursor-pointer text-sm ${props.className ?? ""}`}>
                    {!values.length && <Subtext>{placeholder}</Subtext>}
                    {values.length === 1 && options[values[0]]}
                    {values.length >= 2 && `${values.length} selected`}
                    <ChevronDown />
                </button>
            </DropdownTrigger>
            <DropdownContent>
                {/* TODO: search unfocuses after some character inputs */}
                {searchable &&
                    <Input
                        placeholder="Search..."
                        className="mb-1 border-2 border-bg-lightest!"
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        autoFocus
                    />
                }
                {Object.keys(options)
                    .filter(o => !search || o.toLowerCase().includes(search.toLowerCase()))
                    .map(k => <DropdownItem
                        onClick={() => {
                            if (values.includes(k))
                                onChange([...values.slice(0, values.indexOf(k)), ...values.slice(values.indexOf(k) + 1)]);
                            else
                                onChange([...values, k]);
                        }}
                        className={"border-2 border-transparent flex flex-row gap-1 items-center not-last:mb-1"}
                        key={k}
                        onSelect={e => e.preventDefault()}
                        selected={values.includes(k)}
                    >
                        {options[k]}
                    </DropdownItem>)
                }
            </DropdownContent>
        </Dropdown>
    );
}
