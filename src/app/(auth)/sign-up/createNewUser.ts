"use server";
import { prisma } from "@/lib/db/prisma";
import { zodFields } from "@/utils";
import { hash } from "bcrypt";
import { z } from "zod";

export default async function createNewUser(formData: FormData): Promise<
  | {
      create: true;
    }
  | { create: false; error: string }
> {
  let fields = Object.fromEntries(formData.entries());
  let fieldsSchema = z.object({
    ...zodFields,
  });
  let validation = fieldsSchema.safeParse(fields);
  if (!validation.success) {
    return {
      create: false,
      error: "some of your inputs is invalid, check your inputs again!",
    };
  }

  let isExist = await prisma.user.findUnique({
    where: { email: validation.data.email },
    select: { id: true },
  });

  if (isExist) {
    return {
      create: false,
      error: "user already exists",
    };
  }

  let hashedPass = await hash(validation.data.password, 10);
  try {
    await prisma.user.create({
      data: {
        first_name: validation.data.firstname,
        last_name: validation.data.lastname,
        email: validation.data.email,
        username: validation.data.username,
        profile_pic: "https://omzid.serv00.net/images/default.png",
        password: hashedPass,
      },
    });
  } catch (error) {
    return {
      create: false,
      error: "something went wrong please try again",
    };
  }
  return {
    create: true,
  };
}
