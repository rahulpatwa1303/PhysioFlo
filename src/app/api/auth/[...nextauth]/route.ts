import NextAuth from "next-auth";
import { handler } from "./AuthConfig";

export const { auth } = NextAuth(handler);

export { handler as GET, handler as POST };
