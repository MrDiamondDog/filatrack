import ReactSkeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

type Props = {
    width?: number | string;
    height?: number | string;
    count?: number;
    className?: string;
};

export default function Skeleton({ width, height, count, className }: Props) {
    return (
        <ReactSkeleton
            containerClassName={`leading-none ${className ?? ""}`}
            width={width}
            height={height}
            count={count}
            enableAnimation
            baseColor="var(--color-bg-light)"
            highlightColor="var(--color-bg-lighter)"
        />
    );
}
