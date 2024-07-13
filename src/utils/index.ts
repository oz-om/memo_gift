import { z } from "zod";
type resCallbackType = { upload: true; id: string } | { upload: false };
// dashboard orders number of orders to get for each page
export const ORDERS_LIMIT_PAGINATION: number = 20;

// urls
export const APP_API_URL = process.env.APP_API_URL as string;
export const CLIENT_APP_API_URL = process.env.NEXT_PUBLIC_APP_API_URL as string;
// uploadUrl
export const UPLOAD_URL = process.env.NEXT_PUBLIC_UPLOAD_URL as string;

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
// format time / number
export function formatNumber(number: number | string) {
  const formatter = new Intl.NumberFormat("en-US", {
    minimumIntegerDigits: 2,
  });
  const formattedNumber = formatter.format(Number(number));
  return formattedNumber;
}
export function timeDetails(time: Date): {
  day: string;
  monthName: string;
  monthNumber: string;
  dayOfMonth: string;
  minutes: string;
  hours: string;
  year: number;
} {
  const createdAt = new Date(time);
  const hours = formatNumber(createdAt.getHours());
  const minutes = formatNumber(createdAt.getMinutes());
  const dayOfMonth = formatNumber(createdAt.getDate());
  const monthFormatter = (type: "numeric" | "long") => new Intl.DateTimeFormat("en-US", { month: type }).format(createdAt);
  const monthNumber = formatNumber(monthFormatter("numeric"));
  const monthName = formatNumber(monthFormatter("long"));
  const year = createdAt.getFullYear();

  const weekdays = new Intl.DateTimeFormat("en-US", { weekday: "long" }).format(createdAt);

  return {
    day: weekdays,
    monthName,
    dayOfMonth,
    year,
    hours,
    minutes,
    monthNumber,
  };
}

// month day_in_month, year =>  "May 6, 2024"
export function formatDate(inputDateStr: string) {
  const date = new Date(inputDateStr);

  const options: {} = {
    year: "numeric",
    month: "short",
    day: "numeric",
  };

  const formatter = new Intl.DateTimeFormat("en-US", options);
  const formattedDate = formatter.format(date);

  return formattedDate;
}

// format currency
export function formatCurrency(value: number, currencyCode: string = "DH") {
  value = Number(value);

  const formatter = new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  const formattedValue = formatter.format(value);

  return `${formattedValue} ${currencyCode}`;
}

export function stringToBoolean(booleanString: "true" | "false" | undefined) {
  if (booleanString === "true") {
    return true;
  }
  return false;
}

// upload images
export async function getUploadSession() {
  try {
    const uploadSessionReq = await fetch(UPLOAD_URL);
    const uploadSessionRes: { sessionID: string } = await uploadSessionReq.json();
    return uploadSessionRes.sessionID;
  } catch (error) {
    return null;
  }
}
export async function uploadImage(image: File, id: string, sessionId: string, folder: string, callback: (err: string | null, res: resCallbackType) => void) {
  let formDate = new FormData();
  formDate.append("image", image);
  formDate.append("id", id);
  formDate.append("sessionId", sessionId);
  formDate.append("folder", folder);
  fetch(UPLOAD_URL, {
    method: "POST",
    body: formDate,
  })
    .then((response) => response.json())
    .then((res) => {
      if (res.upload) {
        callback(null, { upload: true, id: res.id });
      } else {
        callback("uploading failed", { upload: false });
      }
    })
    .catch((error) => {
      console.log(error);
      callback("something went wrong", { upload: false });
    });
}

// confirm uploaded images
type T_uploadImages = {
  id?: string;
  name: string;
}[];
type T_uploadImagesFolder = "item" | "premade" | "card" | "variant" | "blog" | "user" | "";
export type T_confirmUploadsType = { confirmation: true; uploads: string[] } | { confirmation: false; error: string };
export async function confirmUploadImages(images: T_uploadImages, uploadImagesFolder: T_uploadImagesFolder) {
  const confirmUploadReq = await fetch(UPLOAD_URL, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      folder: uploadImagesFolder,
      images: images,
    }),
  });
  const confirmUploadRes: T_confirmUploadsType = await confirmUploadReq.json();
  return confirmUploadRes;
}
