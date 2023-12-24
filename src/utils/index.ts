import { z } from "zod";

export function toggleDialog(dialogClass: string) {
  let dialog = document.querySelector(`dialog.${dialogClass}`);
  let d = dialog as HTMLDialogElement;
  if (d.open) {
    d.close();
  } else {
    d.showModal();
  }
  document.body.classList.toggle("overflow-hidden");
  document.body.classList.toggle("sm:overflow-auto");
}

export const zodFields = {
  firstname: z
    .string({
      required_error: "first name is required",
    })
    .min(2, "first name most be more than 1 letter"),
  lastname: z
    .string({
      required_error: "last name is required",
    })
    .min(2, "last name most be more than 1 letter"),
  username: z
    .string({
      required_error: "user name is required",
    })
    .min(3, "username most be more than 3 letter"),
  email: z
    .string({
      required_error: "email is required",
    })
    .email("invalid email"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters long")
    .refine((password) => {
      const hasSpecialChar = /[@$%^!~(){}\[\]"']/.test(password);
      const hasUpperCase = /[A-Z]/.test(password);
      return hasSpecialChar && hasUpperCase;
    }, "Password must contain at least one special character and one uppercase letter"),
};
