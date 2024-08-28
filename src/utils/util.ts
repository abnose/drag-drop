import moment from "moment-jalaali";
export function getRandomInt(max: number): number {
  return Math.floor(Math.random() * max);
}

export function handleDate(dateString: string): string {
  // Parse the input date string into a moment object
  const date = moment(dateString);

  // Convert the moment object to Jalali date format
  const persianDate = date.format("dddd D MMMM");

  // Return the Persian date
  return persianDate;
}
