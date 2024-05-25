import Visit from "@/app/Models/visits";
import connectDB from "@/app/lib/connectDB";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (request: NextRequest) => {
  try {
    const body = await request.json();

    // **Validate Data Structure:**
    if (!body.visit || !body.visit._id) {
      throw new Error('Missing required fields in request body: "visit._id"');
    }

    await connectDB(); // Ensure connection

    // **Log Request Body:**

    const updateValue =
      body.action === "complete"
        ? { completed: true }
        : body.action === "cancel"
        ? { completed: false, cancel: true }
        : body.action === "undo"
        ? { completed: false, cancel: false }
        : {};
    const result = await Visit.findByIdAndUpdate(
      { _id: body.visit._id },
      { ...body.visit, ...updateValue },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    if (!result) {
      console.error("Document not found for update"); // Handle document not found case
    }

    return NextResponse.json({ done: "done" },{ status: 201 });
  } catch (error) {
    return NextResponse.json(
      { message: "Error updating document", error: (error as Error).message },
      { status: 500 }
    ); // Send appropriate error response
  }
};
