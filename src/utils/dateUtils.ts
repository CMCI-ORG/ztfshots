import { format } from "date-fns";

export const formatPostDate = (date: Date): string => {
  return date.toISOString().split('T')[0];
};

export const getQuoteStatus = (postDate: Date): 'scheduled' | 'live' => {
  return postDate > new Date() ? 'scheduled' : 'live';
};

export const formatDisplayDate = (date: Date): string => {
  return format(date, "PPP");
};