import { Session } from "inspector";
import NextAuth from "next-auth";
export type authUser = {
  id: string;
  email: string;
  username: string;
  role: string;
  profile_pic: string | null;
};
declare module "next-auth" {
  interface User extends authUser {}
  interface Profile {
    family_name: string;
    given_name: string;
  }
  // interface jwt {
  //   user: authUser
  // }
  interface Session {
    user: authUser;
    // token:authUser
  }
}
