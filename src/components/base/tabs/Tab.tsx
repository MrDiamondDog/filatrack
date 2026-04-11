export default function Tab(props: { name: string, className?: string } & React.PropsWithChildren) {
    return (
        <div data-tab={props.name} className={props.className}>
            {props.children}
        </div>
    );
}
