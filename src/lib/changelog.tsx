export const version = "v1.2.4";

export const changelog = [
    {
        date: "12/16/2025",
        version: "v1.2.4",
        content: <ul>
            <li>Fixed adding material picker options and increased material name max length</li>
            <li>Fixed issues with bulk adding filament in boxes</li>
            <li>Fixed filament count in boxes when deleting filament (will not apply retroactively)</li>
            <li>Reworked how random toasts work</li>
        </ul>,
    },
    {
        date: "7/22/2025",
        version: "v1.2.3",
        content: <ul>
            <li>
                QR code rework!
                <ul>
                    <li>Now look better and are easier to cut out</li>
                    <li>Color swatch option</li>
                    <li>Faster loading on QR page</li>
                </ul>
            </li>
            <li>Some backend reworking</li>
            <li>Update landing page background a little</li>
            <li>Change 'Your Filament' to a collapsable 'All Filament' section</li>
        </ul>,
    },
    {
        date: "7/21/2025",
        version: "v1.2.2",
        content: <ul>
            <li>Fix box sorting</li>
            <li>Fix weird bug with moving filament into boxes</li>
        </ul>,
    },
    {
        date: "7/20/2025",
        version: "v1.2.1",
        content: <ul>
            <li>You can now reorder boxes</li>
            <li>Fix box list on mobile</li>
            <li>Fix reversed recent filament list on dashboard</li>
            <li>Fixed a visual bug on the filament page</li>
        </ul>,
    },
    {
        date: "7/19/2025",
        version: "v1.2.0",
        content: <ul>
            <li>
                <b>New filament boxes!</b>
                <ul>
                    <li>Organize your filament in boxes, available in the filament page</li>
                    <li>Move filament to/from filament boxes</li>
                    <li>Bulk move filament</li>
                    <li>Add filament directly in boxes</li>
                </ul>
            </li>
            <li>Remove 'empty filament' section (don't worry, your filament isn't deleted!)</li>
            <li>Fixed searching filament (searching on home page will search through all boxes)</li>
        </ul>,
    },
    {
        date: "7/18/2025",
        version: "v1.1.0",
        content: <ul>
            <li>
                <b>New dashboard page!</b>
                <ul>
                    <li>See overview of filament and your statistics</li>
                    <li>Quickly see recently used filament and add new filament</li>
                    <li>Now the default page when logged in</li>
                </ul>
            </li>
            <li>Backend changes to logging filament</li>
            <li>Fixed visual bugs in filament list</li>
        </ul>,
    },
    {
        date: "7/16/2025",
        version: "v1.0.1",
        content: <ul>
            <li>Fix QR codes always showing '1kg' and 'PLA'</li>
            <li>Fix version in footer getting React version instead of Filatrack version</li>
            <li>Remove unused 'Prints' button in sidebar</li>
            <li>Made the buttons in this dialog actually work</li>
        </ul>,
    },
    {
        date: "7/16/2025",
        version: "v1.0.0",
        content: <ul>
            <li>Added changelogs!</li>
            <li>Standardized version numbers</li>
        </ul>,
    },
];
