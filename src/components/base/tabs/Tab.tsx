export default function Tab(props: Readonly<{ children: React.ReactNode, name: string, className?: string }>) {
    return (
        <div data-tab={props.name} className={props.className}>
            {props.children}
        </div>
    );
}
