'use client'
import { useRouter } from 'next/router';

export default function ActivePathCheck(link:string) {
  const router = useRouter();
  const { asPath } = router;

  const isHomePath = asPath.startsWith(link);

  return { isHomePath };
}

export function parseDateFromUrl(dateString:string) {
  // Known date formats
  const knownFormats = [
    /\d{4}-\d{2}-\d{2}/, // YYYY-MM-DD
    /\d{2}\/\d{2}\/\d{4}/, // MM/DD/YYYY
    /\d{2}\/\d{2}\/\d{4}/ // DD/MM/YYYY (same format as MM/DD/YYYY)
  ];

  // Attempt parsing with known formats
  for (const format of knownFormats) {
    const match = dateString.match(format);
    if (match) {
      const [matchedDate] = match;
      const parsedDate = new Date(matchedDate);
      if (!isNaN(parsedDate.getTime())) {
        return parsedDate;
      }
    }
  }

  // Fallback to dynamic parsing
  const dynamicParsedDate = new Date(dateString);
  if (!isNaN(dynamicParsedDate.getTime())) {
    return dynamicParsedDate;
  }

  // Handle invalid date
  console.error('Invalid date format:', dateString);
  return new Date(); // Return default date or handle differently as needed
}