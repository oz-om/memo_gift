export default function getErrorMessage(error: unknown, customErrorMessage?: string): string {
  let errorMessage: string;
  if (error instanceof Error) {
    errorMessage = error.message;
  } else if (error && typeof error === "object" && "error" in error) {
    errorMessage = String(error.error);
  } else if (error && typeof error === "object" && "message" in error) {
    errorMessage = String(error.message);
  } else if (typeof error === "string") {
    errorMessage = error;
  } else {
    errorMessage = customErrorMessage ?? "something went wrong";
  }

  return errorMessage;
}
