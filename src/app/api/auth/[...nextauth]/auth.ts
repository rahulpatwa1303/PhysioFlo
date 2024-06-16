// src/app/lib/authOptions.ts

import User from "@/app/Models/user";
import connectDB from "@/app/lib/connectDB";
import NextAuth, {
  NextAuthOptions,
  Session,
  User as NextAuthUser,
} from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { JWT } from "next-auth/jwt";
import { AdapterUser } from "next-auth/adapters";

interface ExtendedJWT extends JWT {
  accessToken?: string;
  refreshToken?: string;
  accessTokenExpires?: number;
  error?: string;
}

interface ExtendedSession extends Session {
  accessToken?: string;
  error?: string;
}

const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      httpOptions: {
        timeout: 10000,
      },
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
    signIn: "/user/signIn",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
  jwt: {
    secret: process.env.NEXTAUTH_SECRET,
    maxAge: 5 * 60 * 60, // 5 hours
  },
  callbacks: {
    async signIn({
      profile,
    }: {
      profile?: any | AdapterUser;
    }): Promise<string | boolean> {
      await connectDB();
      const existingUser = await User.findOne({
        email: profile?.email,
        is_registered: true,
      });

      if (existingUser) {
        if (!existingUser.picture || !existingUser.name) {
          await User.findOneAndUpdate(
            { email: profile?.email },
            { picture: profile?.picture, name: profile?.name },
            { upsert: true, new: true, safe: true }
          );
        }
        return true;
      } else {
        return "/user/signup";
      }
    },
    async jwt({
      token,
      account,
    }: {
      token: ExtendedJWT;
      account?: any;
    }): Promise<ExtendedJWT> {
      if (account) {
        token.accessToken = account.access_token;
        token.refreshToken = account.refresh_token;
        token.accessTokenExpires = Date.now() + account.expires_in * 1000;
      }

      if (Date.now() < token.accessTokenExpires!) {
        return token;
      }

      return refreshAccessToken(token);
    },
    async session({
      session,
      token,
    }: {
      session: ExtendedSession;
      token: ExtendedJWT;
    }): Promise<ExtendedSession> {
      session.accessToken = token.accessToken;
      session.error = token.error;
      return session;
    },
  },
};

export default authOptions;

export async function refreshAccessToken(
  token: ExtendedJWT
): Promise<ExtendedJWT> {
  try {

    const url = "https://oauth2.googleapis.com/token";
    const body = new URLSearchParams({
      client_id: process.env.GOOGLE_CLIENT_ID!,
      client_secret: process.env.GOOGLE_CLIENT_SECRET!,
      grant_type: "refresh_token",
      refresh_token: token.refreshToken!,
    });

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: body.toString(),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Error data:", errorData);
      throw new Error("Failed to refresh access token");
    }

    const refreshedTokens = await response.json();

    return {
      ...token,
      accessToken: refreshedTokens.access_token,
      accessTokenExpires: Date.now() + refreshedTokens.expires_in * 1000,
      refreshToken: refreshedTokens.refresh_token ?? token.refreshToken,
    };
  } catch (error) {
    console.error("Error refreshing access token:", error);

    return {
      ...token,
      error: "RefreshAccessTokenError",
    };
  }
}
