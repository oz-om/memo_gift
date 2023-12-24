import { authOptions } from "@/utils/nextAuthOptions";
import nextAuth from "next-auth/next";

const auth = nextAuth(authOptions);

export { auth as GET, auth as POST };
