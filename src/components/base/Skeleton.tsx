import ReactSkeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

export default function Skeleton({ width, height, count, className }:
    { width?: number | string, height?: number | string, count?: number, className?: string }) {
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
