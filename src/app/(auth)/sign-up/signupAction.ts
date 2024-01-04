"use client";
import getErrorMessage from "@/utils/getErrorMessage";
import { loginAction } from "../sign-in/loginAction";
import createNewUser from "./createNewUser";
export default async function signupAction(formData: FormData) {
  let create = await createNewUser(formData);
  if (!create.create) {
    throw new Error(create.error);
  }
  try {
    await loginAction(formData);
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
}
