import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Converts an event's local date and 12-hour time into a UTC date string.
 */
export const formatDate = (date: string, time12h: string): string => {
  const [time, modifier] = time12h.split(" ");
  let [hours, minutes] = time.split(":");

  if (hours === "12") hours = "00";

  if (modifier === "PM") {
    hours = (parseInt(hours, 10) + 12).toString();
  }

  const localDateTime = new Date(`${date}T${hours.padStart(2, "0")}:${minutes}:00`);

  return localDateTime.toISOString().split("T")[0];
};

/**
 * Converts an event's local date and 12-hour time into a UTC time string.
 */
export const formatTimeTo24Hour = (date: string, time12h: string): string => {
  const [time, modifier] = time12h.split(" ");
  let [hours, minutes] = time.split(":");

  if (hours === "12") hours = "00";

  if (modifier === "PM") {
    hours = (parseInt(hours, 10) + 12).toString();
  }

  const localDateTime = new Date(`${date}T${hours.padStart(2, "0")}:${minutes}:00`);

  return localDateTime.toISOString().split("T")[1].slice(0, 5);
};
