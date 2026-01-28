import Subtext from "../base/Subtext";

export default function CardDetail({ children }: React.PropsWithChildren) {
    return (<Subtext className="flex flex-row gap-1 items-center text-xs md:text-sm">{children}</Subtext>);
}
