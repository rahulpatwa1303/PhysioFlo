import User from "@/app/Models/user";
import connectDB from "@/app/lib/connectDB";
import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

const handler = NextAuth({
  // Configure one or more authentication providers
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          scope:
            "openid email profile https://www.googleapis.com/auth/calendar",
          access_type: "offline",
          prompt: "consent",
        },
      },
    }),
  ],
  pages: {
    signIn: "/auth/signIn",
  },
  session: {
    strategy: "jwt",
    maxAge: 4 * 60 * 60, // 4 hours
  },
  callbacks: {
    async signIn(params: {
      profile?: any | undefined;
    }): Promise<true | "/auth/signup"> {
      await connectDB();
      const existingUser = await User.findOne({
        email: params.profile?.email, // Optional chaining
        is_registered: true,
      });

      if (existingUser) {
        if (!existingUser.picture || !existingUser.name) {
          await User.findOneAndUpdate(
            { email: params.profile?.email }, // Optional chaining
            {
              picture: params.profile?.picture, // Optional chaining
              name: params.profile?.name, // Optional chaining
            },
            { upsert: true, new: true, safe: true }
          );
        }
        return true;
      } else {
        return "/auth/signup";
      }
    },
    async jwt({ token, account }) {
      if (account) {
        token.accessToken = account.access_token;
        token.refreshToken = account.refresh_token;
        token.idToken = account.id_token;
        token.accessTokenExpires = account.expires_at! * 1000;
      }
      return token;
    },
    async session({ session, token }: { session: any; token: any }) {
      session.accessToken = token.accessToken;
      session.refreshToken = token.refreshToken;
      session.idToken = token.idToken;
      return session;
    },
  },
});

export const { auth } = NextAuth(handler);

export { handler as GET, handler as POST };
