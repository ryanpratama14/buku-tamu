import { type ReadonlyURLSearchParams } from "next/navigation";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { LOCALE_TAG } from "@/trpc/shared";

export const loadToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
};

export const cn = (...inputs: ClassValue[]): string => twMerge(clsx(inputs));

export const consoleError = (error: string) => {
  console.error(
    `❌ ${new Date().toLocaleTimeString(LOCALE_TAG, { hour: "2-digit", minute: "2-digit", second: "2-digit" })} 👉 ${error}`
  );
};

export const createUrl = (pathname: string, params: URLSearchParams | ReadonlyURLSearchParams) => {
  const paramsString = params.toString();
  const queryString = `${paramsString.length ? "?" : ""}${paramsString}`;
  return `${pathname}${queryString}`;
};

export const formatName = (name: string): string => {
  const trimmedName = name.trim();
  const words = trimmedName.split(/\s+/); // Split by one or more spaces
  const capitalizedWords = words.map((word) => {
    const lowercaseWord = word.toLowerCase();
    return lowercaseWord.charAt(0).toUpperCase() + lowercaseWord.slice(1);
  });
  const convertedName = capitalizedWords.join(" ");
  return convertedName;
};

export const textEllipsis = (text: string, length: number) => {
  if (!text) return "";
  return text.length < length ? `${text}` : `${text?.substring(0, length - 3)}...`;
};

export const createSearchParams = (
  params: Record<string, string | string[]>,
  newParams?: URLSearchParams
): URLSearchParams => {
  const updatedParams = new URLSearchParams(newParams);
  for (const [key, values] of Object.entries(params)) {
    if (Array.isArray(values)) {
      for (const value of values) {
        updatedParams.append(key, value);
      }
    } else {
      updatedParams.append(key, values);
    }
  }
  return updatedParams;
};

export const getTodayDate = () => {
  const date = new Date();
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, "0");
  const day = String(date.getUTCDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

export const getTodayDateLong = (): string => {
  return new Date().toLocaleDateString(LOCALE_TAG, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

export const getNewDate = (dateString?: string): Date => {
  if (dateString) return new Date(dateString);
  return new Date();
};

export const getStartDate = (dateString: string): Date => {
  const updatedDate = getNewDate(dateString);
  updatedDate.setHours(0, 0, 0, 0);
  return updatedDate;
};

export const getEndDate = (dateString: string): Date => {
  const updatedDate = getNewDate(dateString);
  updatedDate.setHours(23, 59, 59, 999);
  return updatedDate;
};

export const formatDate = (dateString: Date): string => {
  const date = new Date(dateString);
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, "0");
  const day = String(date.getUTCDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

export const formatDateLong = (date: Date): string => {
  return date.toLocaleDateString(LOCALE_TAG, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

export const formatDateTimeLong = (date: Date): string => {
  return date.toLocaleDateString(LOCALE_TAG, {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export const formatTime = (date: Date): string => {
  return date.toLocaleTimeString(LOCALE_TAG, {
    timeStyle: "short",
  });
};

export const getDateFromObject = ({ startTime, startDate }: { startTime: string; startDate: string }): Date => {
  const combinedDateTimeString = `${startDate}T${startTime}`;
  const localTimeZoneOffset = new Date().getTimezoneOffset();
  const utcDateTime = new Date(`${combinedDateTimeString}Z`);
  utcDateTime.setMinutes(utcDateTime.getMinutes() + localTimeZoneOffset);
  return utcDateTime;
};
