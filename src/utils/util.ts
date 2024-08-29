export function getRandomInt(max: number): number {
  return Math.floor(Math.random() * max);
}

export function handleDate(dateString: string): string {
  let createDate = new Date(dateString).toLocaleDateString('fa-IR', { year: 'numeric', month: 'long', day: 'numeric' });
  return createDate
}
