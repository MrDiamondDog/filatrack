import RequiredStar from "./RequiredStar";
import Subtext from "./Subtext";

export default function Input(props: React.InputHTMLAttributes<HTMLInputElement>
    & { label?: string, subtext?: string, containerClassName?: string }) {
    return (<div className={`flex flex-col gap-1 ${props.containerClassName}`}>
        {props.label && <label htmlFor={props.label.replaceAll(" ", "-")}>{props.label}{props.required && <RequiredStar />}</label>}

        <input {...props}
            id={props.label ? props.label.replaceAll(" ", "-") : undefined}
            className={`bg-bg-lighter border-2 border-transparent focus:border-primary 
                px-2 py-1 rounded-lg outline-none ${props.className}`}
        />

        {props.subtext && <Subtext className="mb-2">{props.subtext}</Subtext>}
    </div>);
}
