"use server";
import { prisma } from "@/lib/db/prisma";
import { authOptions } from "@/utils/nextAuthOptions";
import { Prisma } from "@prisma/client";
import { getServerSession } from "next-auth";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import React from "react";
import { render } from "@react-email/components";
import ResetPasswordTemplate from "../help/forget-password/components/ResetPasswordEmailTemplate";
import { randomUUID } from "crypto";
import { compare, hash } from "bcrypt";
import { z } from "zod";
import sgMail from "@sendgrid/mail";
sgMail.setApiKey(process.env.SENDGRID_API_KEY as string);

export type T_Address = Prisma.AddressGetPayload<{
  select: {
    user_id: true;
    address: true;
    id: true;
  };
}>;
export type T_submitAddressAction = { action: "create"; userId: string; address: string } | { action: "update"; addressId: string; address: string };

function updateAddress(addressId: string, address: string) {
  return prisma.address.update({
    where: {
      id: addressId,
    },
    data: {
      address,
    },
    select: {
      user_id: true,
      id: true,
      address: true,
    },
  });
}
function createAddress(userId: string, address: string) {
  return prisma.address.create({
    data: {
      address,
      user_id: userId,
    },
    select: {
      user_id: true,
      id: true,
      address: true,
    },
  });
}
export async function submitAddressAction(addressDetails: T_submitAddressAction): Promise<{ success: true; address: T_Address } | { success: false; error: string }> {
  const { action, address } = addressDetails;
  try {
    switch (action) {
      case "create":
        const newAddress = await createAddress(addressDetails.userId, address);
        revalidatePath("");
        return {
          success: true,
          address: newAddress,
        };
      case "update":
        const addressUpdate = await updateAddress(addressDetails.addressId, address);
        revalidatePath("");
        return {
          success: true,
          address: addressUpdate,
        };
      default:
        throw new Error(`action prop doesn't exist`);
    }
  } catch (error) {
    return {
      success: false,
      error: "ops! something went wrong, please try again",
    };
  }
}
export async function deleteAddress(addressId: string): Promise<{ success: true } | { success: false; error: string }> {
  try {
    const userSession = await getServerSession(authOptions);
    if (!userSession) return { success: false, error: "you need to login to complete this process" };
    await prisma.address.delete({
      where: {
        id: addressId,
        user_id: userSession.user.id,
      },
    });
    revalidatePath("");
    return {
      success: true,
    };
  } catch (error) {
    return {
      success: false,
      error: "something went wrong during delete operation, please try again later!",
    };
  }
}

// help reset password
export async function senEmail(formData: FormData): Promise<{ success: true } | { success: false; error: string }> {
  const to = formData.get("email");
  if (!to && to?.trim().length == 0) return { success: false, error: "please enter a valid email address!" };
  let TOKEN: string | null = null;
  try {
    // check if user exists
    const user = await prisma.user.findUnique({
      where: {
        email: `${to}`,
      },
      select: { id: true, email: true },
    });

    if (!user) return { success: false, error: "please enter a valid email address!" };

    const isWithPrevToken = await prisma.resetPasswordToken.findUnique({
      where: {
        userId: user.id,
      },
    });

    const RANDOM_TOKEN = randomUUID().split("-").join("");
    const now = new Date();
    const oneHourLater = new Date(now.getTime() + 60 * 60 * 1000);

    if (isWithPrevToken) {
      if (new Date(isWithPrevToken.expires) > new Date()) {
        // token still valid, send prev token
        TOKEN = isWithPrevToken.token;
      } else {
        // update token with nww token
        const updatedToken = await prisma.resetPasswordToken.update({
          where: {
            userId: user.id,
          },
          data: {
            token: RANDOM_TOKEN,
            expires: oneHourLater,
          },
        });
        TOKEN = updatedToken.token;
      }
    } else {
      const newToken = await prisma.resetPasswordToken.create({
        data: {
          token: RANDOM_TOKEN,
          userId: user.id,
          expires: oneHourLater,
        },
      });
      TOKEN = newToken.token;
    }
    // extra check for token
    if (!TOKEN) return { success: false, error: "something went wrong, please try again!" };

    const htmlEmail = render(React.createElement(ResetPasswordTemplate, { confirmURL: `${process.env.NEXT_PUBLIC_APP_URL}/help/new-password?token=${TOKEN}` }));

    // send mail with defined transport object
    const emailDetails = {
      from: `Memory Gift  <${process.env.APP_EMAIL_SENDER}>`,
      to: to as string,
      subject: "Reset Password",
      html: htmlEmail,
    };

    await sgMail.send(emailDetails);

    return {
      success: true,
    };
  } catch (error) {
    console.log(error);

    return {
      success: false,
      error: "ops! something went wrong, please try again.",
    };
  }
}

export async function isTokenValid(token: string): Promise<{ success: true; userId: string } | { success: false; error: string }> {
  if (!token) return { success: false, error: "invalid token!" };
  try {
    const storedToken = await prisma.resetPasswordToken.findFirst({
      where: {
        token,
        expires: {
          gt: new Date(),
        },
      },
    });
    if (!storedToken) {
      return {
        success: false,
        error: "invalid token",
      };
    }
    return {
      success: true,
      userId: storedToken.userId,
    };
  } catch (error) {
    return { success: false, error: "ops! something went wrong" };
  }
}

const passwordField = z.object({
  password: z
    .string()
    .min(6)
    .refine((password) => {
      const hasSpecialChar = /[@$%^!~(){}\[\]"']/.test(password);
      const hasUpperCase = /[A-Z]/.test(password);
      return hasSpecialChar && hasUpperCase;
    }),
});
export async function updateUserPassword(password: string, userId: string, fromToken: boolean = true, oldPassword: string | null = null): Promise<{ success: true } | { success: false; error: string }> {
  if (!password || !userId) return { success: false, error: "invalid password" };

  const validPassword = passwordField.safeParse({ password });

  if (!validPassword.success) return { success: false, error: "invalid password! check length > 6 , special characters" };

  try {
    if (!fromToken && oldPassword) {
      const user = await prisma.user.findUnique({
        where: {
          id: userId,
        },
        select: {
          password: true,
        },
      });
      if (!user) {
        return {
          success: false,
          error: "something went wrong, please try again!",
        };
      }
      const isSamePass = await compare(oldPassword, user.password);
      if (!isSamePass) {
        return {
          success: false,
          error: "password is incorrect!",
        };
      }
    }
    await prisma.$transaction(async (prisma) => {
      if (fromToken) {
        await prisma.resetPasswordToken.update({
          where: {
            userId,
          },
          data: {
            token: null,
            expires: new Date(),
          },
        });
      }
      const hashedPassword = await hash(password, 10);
      await prisma.user.update({
        where: {
          id: userId,
        },
        data: {
          password: hashedPassword,
        },
      });
    });
    return {
      success: true,
    };
  } catch (error) {
    return {
      success: false,
      error: "something went wrong, please try again!",
    };
  }
}
