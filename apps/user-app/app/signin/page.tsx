import { getServerSession } from "next-auth"
import { authOptions } from "../lib/auth"
import SigninComponent from "../../components/Signin";
import { redirect } from "next/navigation";

const signinPage = async () => {
    const session = await getServerSession(authOptions);
    if (session?.user) {
        redirect("/");
    }
    return (
        <SigninComponent />
    )
}

export default signinPage;