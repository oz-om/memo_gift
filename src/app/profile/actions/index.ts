"use server";
import { prisma } from "@/lib/db/prisma";
import { T_changedField } from "../components/User_Details";

export async function changeUserDetailsAction(userId: string, changedDetails: T_changedField): Promise<{ success: true } | { success: false; error: string }> {
  try {
    await prisma.user.update({
      where: {
        id: userId,
      },
      data: changedDetails,
    });
    return {
      success: true,
    };
  } catch (error) {
    console.log(error);

    return {
      success: false,
      error: "something went wrong during update your info, please try again!",
    };
  }
}

export async function updateUserPick(userId: string, picture: string): Promise<{ success: true } | { success: false; error: string }> {
  try {
    await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        profile_pic: picture,
      },
    });
    return { success: true };
  } catch (error) {
    return { success: false, error: "Something went wrong during update your picture, please try again" };
  }
}
