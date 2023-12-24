import NextAuth from "next-auth";
type authUser = {
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
}
