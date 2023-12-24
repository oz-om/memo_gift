"use client";
import getErrorMessage from "@/utils/getErrorMessage";
import { loginAction } from "../sign-in/loginAction";
import createNewUser from "./createNewUser";
export default async function signupAction(formData: FormData) {
  try {
    await createNewUser(formData);
    await loginAction(formData);
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
}
