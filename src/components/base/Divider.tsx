export default function Divider({ vertical, className }: { vertical?: boolean, className?: string }) {
    return (<div
        className={`${vertical ? "self-stretch min-w-0.5 mx-2" : "w-full h-0.5 my-2"} 
        bg-bg-lighter 
        ${className ?? ""}`}
    />);
}
