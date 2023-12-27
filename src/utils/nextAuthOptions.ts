import { NextAuthOptions } from "next-auth";
import googleProvider from "next-auth/providers/google";
import credentialsProvider from "next-auth/providers/credentials";
import { prisma } from "@/lib/db/prisma";
import { compare } from "bcrypt";

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
  },
  providers: [
    googleProvider({
      clientId: process.env.GOOGLE_ID as string,
      clientSecret: process.env.GOOGLE_SECRET_KEY as string,
    }),
    credentialsProvider({
      name: "credentials",
      credentials: {
        email: {
          type: "email",
        },
        password: {
          type: "password",
        },
      },
      async authorize(credentials) {
        if ((credentials && !credentials.email.trim().length) || !credentials?.password.trim().length) {
          throw new Error("credentials are required");
        }
        let existUser = await prisma.user.findUnique({
          where: { email: credentials.email },
          select: {
            id: true,
            username: true,
            email: true,
            profile_pic: true,
            password: true,
            role: true,
          },
        });
        if (existUser) {
          let match = await compare(credentials?.password as string, existUser.password);
          if (!match) throw new Error("email/username or password is wrong");
          let { password, ...user } = existUser;
          return user;
        }
        throw new Error("User not found");
      },
    }),
  ],
  callbacks: {
    async signIn({ profile, account, user, credentials }) {
      let existUser = await prisma.user.findUnique({
        where: {
          email: user.email as string,
        },
        select: {
          id: true,
          email: true,
          username: true,
          profile_pic: true,
          role: true,
        },
      });
      if (account?.provider == "google") {
        if (!existUser) {
          try {
            let newUser = await prisma.user.create({
              data: {
                email: user.email as string,
                username: user.name as string,
                first_name: profile?.given_name as string,
                last_name: profile?.family_name as string,
                password: crypto.randomUUID(),
                profile_pic: user.image,
                role: "user",
              },
              select: {
                id: true,
                email: true,
                username: true,
                profile_pic: true,
                role: true,
              },
            });
            user.id = newUser.id;
            user.username = newUser.username;
            user.profile_pic = newUser.profile_pic;
            user.role = newUser.role;
            return true;
          } catch (error) {
            console.log(error);
            return false;
          }
        }
        user.id = existUser.id;
        user.username = existUser.username;
        user.profile_pic = existUser.profile_pic;
        user.role = existUser.role;
        return true;
      }
      return true;
    },

    jwt: ({ token, user }) => {
      // console.log("user => ", user);
      // console.log("token => ", token);
      if (user) {
        return {
          id: user.id,
          email: user.email,
          username: user.username,
          role: user.role,
          profile_pic: user.profile_pic,
        };
      }
      return token;
    },
    session: ({ session, token }) => {
      // console.log("session token => ", token);
      // console.log("session => ", session);

      return {
        ...session,
        user: {
          id: token.id,
          email: token.email,
          username: token.username,
          role: token.role,
          profile_pic: token.profile_pic,
        },
      };
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/sign-in",
    newUser: "/sign-up",
    error: "/sign-in",
  },
};
