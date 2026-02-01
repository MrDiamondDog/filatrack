import { CustomAttributesRecord } from "@/types/pb";
import Subtext from "../base/Subtext";

export default function CustomAttributeCard({ attribute }: { attribute: CustomAttributesRecord }) {
    return (<div className="flex gap-2 items-center w-full bg-bg-light p-2 px-3 rounded-lg">
        <div className="flex gap-2 items-center pt-1 justify-between w-full">
            <p>{attribute.name}</p>
            <Subtext>{attribute.type === "string" ? "Text" : "Number"}</Subtext>
            {attribute.units && <Subtext>{attribute.units}</Subtext>}
        </div>
    </div>);
}
