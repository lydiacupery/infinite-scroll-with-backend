import * as DateIso from "core/date-iso";
import * as TimeIso from "core/time-iso";
import * as DateFns from "date-fns";
import { Brand } from "helpers";

export type Type = Brand<string, "ISO8601DateTime">;

// expand as needed
export type IANA_TIMEZONES = "America/Detroit" | "America/Chicago";

// not a perfect regex but probably good enough for our needs
export const VALID_REGEX = /^(\d{4})-(\d{2})-(\d{2})T\d{2}:\d{2}:\d{2}(\.\d{3})?([+-]|Z)(([01]\d|2[0-3]):([0-5]\d))?$/;

export function timeFromTimestamp(timestamp: string): TimeIso.Type {
  return TimeIso.fromDate(new Date(Date.parse(timestamp)));
}
export function toIsoDateTime(dateTime: Date | string): Type {
  dateTime =
    typeof dateTime === "string" ? DateFns.parseISO(dateTime) : dateTime;
  // return in utc
  return dateTime.toISOString() as Type;
}

export function now(): Type {
  return toIsoDateTime(new Date());
}
