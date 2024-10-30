import { UserButton } from "@clerk/nextjs";
import { auth, currentUser } from "@clerk/nextjs/server";

const MemberProfile = async () => {
    const user = await currentUser();
    return (
        <div
            className="p-4 flex items-center mx-auto"
            style={{ width: "fit-content" }}
        >
            <UserButton id="btnUserBtn" afterSignOutUrl="/" className="h-10" />
            <button className="ml-2">{`${user.firstName} ${user.lastName}`}</button>
        </div>
    );
};

export default MemberProfile;
