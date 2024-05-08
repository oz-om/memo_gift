import { z } from "zod";

export function toggleDialog(dialogClass: string) {
  let dialog = document.querySelector(`dialog.${dialogClass}`);
  let d = dialog as HTMLDialogElement;
  if (d.open) {
    d.close();
  } else {
    d.setAttribute("open", "true");
    // d.showModal();
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

export const toastStyles = {
  padding: "2px",
  fontSize: "12px",
};

// day  hours:minutes => "Monday 13:55"
export function timeDetails(time: Date) {
  const createdAt = new Date(time);
  const hours = createdAt.getHours();
  const minutes = createdAt.getMinutes();
  const dayOfWeek = createdAt.getDay();
  let day: string = "Sunday";

  switch (dayOfWeek) {
    case 0:
      day = "Sunday";
      break;
    case 1:
      day = "Monday";
      break;
    case 2:
      day = "Tuesday";
      break;
    case 3:
      day = "Wednesday";
      break;
    case 4:
      day = "Thursday";
      break;
    case 5:
      day = "Friday";
      break;
    case 6:
      day = "Saturday";
      break;
  }
  return {
    hours,
    minutes,
    day,
  };
}
// month day_in_month, year =>  "May 6, 2024"
export function formatDate(inputDateStr: string) {
  const date = new Date(inputDateStr);

  const options: {} = {
    year: "numeric",
    month: "long",
    day: "numeric",
  };

  const formatter = new Intl.DateTimeFormat("en-US", options);
  const formattedDate = formatter.format(date);

  return formattedDate;
}

export function stringToBoolean(booleanString: "true" | "false" | undefined) {
  if (booleanString === "true") {
    return true;
  }
  return false;
}
