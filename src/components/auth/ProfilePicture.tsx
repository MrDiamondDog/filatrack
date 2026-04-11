import { pb } from "@/api/pb";
import { UsersRecord } from "@/types/pb";

export default function ProfilePicture({ size }: { size: number; }) {
    const user = pb.authStore.record as UsersRecord | null;

    if (!user)
        return null;

    return <img
        src={user.avatar ? pb.files.getURL(user, user.avatar) : `https://ui-avatars.com/api/?name=${user.name}&background=random`}
        className="rounded-full object-cover"
        style={{ width: `${size}px`, height: `${size}px` }}
        width={size} height={size}
    />;
}
