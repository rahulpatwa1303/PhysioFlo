"use server";
import { redirect } from "next/navigation";
import User from "../Models/user";
import connectDB from "../lib/connectDB";

// Recommended for clarity and potential error catching
export const handleRegisterRequest = async (event: any) => {
  await connectDB();

  if (event.email) {
    try {
      const k = await User.create({
        email: event.email,
        is_registered: false,
      });
      return "success";
    } catch (error) {
      console.error("Error creating document:", error);
      return error;
    }
  } else {
    return "email_not_found" ;
  }
};
