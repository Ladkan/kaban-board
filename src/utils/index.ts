import { isAfter, startOfDay } from "date-fns";

export function isOverDue(dueDate: string): boolean {
  return isAfter(
    startOfDay(new Date()),
    startOfDay(new Date(dueDate))
  )
}