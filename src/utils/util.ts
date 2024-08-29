export function getRandomInt(max: number): number {
  return Math.floor(Math.random() * max);
}

export function handleDate(dateString: string): string {
  let createDate = new Date(dateString).toLocaleDateString('fa-IR', { year: 'numeric', month: 'long', day: 'numeric' });
  return createDate
}
export const stringReducer = (data: string, len: number): string => {
  if (+data.length > len) {
    return data.slice(0, len) + "...";
  }
  return data;
};

export const remainingDays = (
  deadline: string
): { message: string; isPast: boolean } => {
  // Create a new Date object for now and normalize it to midnight
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  // Create a new Date object for the deadline and normalize it to midnight
  const deadlineDate = new Date(deadline);
  const deadlineDay = new Date(
    deadlineDate.getFullYear(),
    deadlineDate.getMonth(),
    deadlineDate.getDate()
  );

  // Calculate the difference in milliseconds
  const differenceInMs = deadlineDay.getTime() - today.getTime();
  const differenceInDays = Math.floor(differenceInMs / (1000 * 60 * 60 * 24));

  // Determine the message and whether it's past
  if (differenceInDays > 0) {
    return {
      message: `${differenceInDays} روز باقی مانده`,
      isPast: false,
    };
  } else if (differenceInDays === 0) {
    return {
      message: `تاریخ امروز است`,
      isPast: false,
    };
  } else {
    return {
      message: `تاریخ گذشته است`,
      isPast: true,
    };
  }
};
