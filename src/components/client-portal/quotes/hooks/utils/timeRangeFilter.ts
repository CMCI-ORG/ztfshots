import { 
  startOfWeek, 
  endOfWeek, 
  startOfMonth, 
  endOfMonth, 
  startOfYear, 
  endOfYear, 
  subMonths, 
  subYears, 
  subWeeks 
} from "date-fns";

export const getTimeRangeFilter = (timeRange: string) => {
  const now = new Date();
  let startDate, endDate;

  switch (timeRange) {
    case "this_week":
      startDate = startOfWeek(now);
      endDate = endOfWeek(now);
      break;
    case "last_week":
      startDate = startOfWeek(subWeeks(now, 1));
      endDate = endOfWeek(subWeeks(now, 1));
      break;
    case "this_month":
      startDate = startOfMonth(now);
      endDate = endOfMonth(now);
      break;
    case "last_month":
      startDate = startOfMonth(subMonths(now, 1));
      endDate = endOfMonth(subMonths(now, 1));
      break;
    case "this_year":
      startDate = startOfYear(now);
      endDate = endOfYear(now);
      break;
    case "last_year":
      startDate = startOfYear(subYears(now, 1));
      endDate = endOfYear(subYears(now, 1));
      break;
    default:
      return { startDate: null, endDate: null };
  }

  return { startDate, endDate };
};