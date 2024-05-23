// src/app/lib/authOptions.ts

import User from "@/app/Models/user";
import connectDB from "@/app/lib/connectDB";
import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

const authOptions: NextAuthOptions = {
  // Configure one or more authentication providers
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      httpOptions: {
        timeout: 10000,
      },
      authorization: {
        params: {
          scope: "openid email profile https://www.googleapis.com/auth/calendar",
          access_type: "offline",
          prompt: "consent",
        },
      },
    }),
  ],
  pages: {
    signIn: "/user/signIn",
  },
  callbacks: {
    async signIn(params: { profile?: any }): Promise<true | string> {
      await connectDB();
      const existingUser = await User.findOne({
        email: params.profile?.email,
        is_registered: true,
      });

      if (existingUser) {
        if (!existingUser.picture || !existingUser.name) {
          await User.findOneAndUpdate(
            { email: params.profile?.email },
            {
              picture: params.profile?.picture,
              name: params.profile?.name,
            },
            { upsert: true, new: true, safe: true }
          );
        }
        return true;
      } else {
        return "/user/signup";
      }
    },
  },
};

export default authOptions;
