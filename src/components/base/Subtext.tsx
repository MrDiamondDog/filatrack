export default function Subtext(props: React.HTMLAttributes<HTMLParagraphElement>) {
    return (
        <p {...props} className={`text-sm text-gray-400 ${props.className ?? ""}`}>
            {props.children}
        </p>
    );
}
