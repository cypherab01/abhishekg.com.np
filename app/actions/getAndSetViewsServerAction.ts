"use server";

import connectToDatabase from "@/lib/database";
import View from "@/model/views.model";

export async function getViewsServerAction() {
  try {
    await connectToDatabase();

    const viewDoc = await View.findOne({});

    return {
      success: true,
      message: viewDoc?.views ?? 0,
    };
  } catch (error) {
    return {
      success: false,
      message: "Failed to get views",
    };
  }
}

export async function setViewsServerAction() {
  try {
    await connectToDatabase();

    const views = await View.findOneAndUpdate(
      {},
      { $inc: { views: 1 } },
      { new: true, upsert: true }
    );

    return {
      success: true,
      message: "Views set successfully",
    };
  } catch (error) {
    return {
      success: false,
      message: "Failed to set views",
    };
  }
}
