export default function Spinner({ className }: { className?: string }) {
    return (
        <span
            className={`w-4 h-4 border-[3px] border-primary border-b-tertiary rounded-full inline-block box-border 
                animate-spin [animation-duration:.75s] relative ${className ?? ""}`}>
        </span>
    );
}
