export class DateUtil {
  public static formatToLocalDate(input: Date): string {
    const date = new Date(input)
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const year = date.getFullYear();
    return `${year}-${month}-${day}`;
  }

  public static formatFromLocalDate(input: string): Date {
    const [year, month, day] = input.split("-").map(Number)

    return new Date(year, month - 1, day)
  }



  public static formatToLabel(input: Date): string {
    const date = new Date(input)
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${month}/${year}`;
  }

  public static formatFromLabel(input: string): Date {
    const [month, year] = input.split("/")

    return new Date(Number(year), Number(month) - 1);
  }

  static onLastDay(newEndDate: Date): Date {
    return new Date(newEndDate.getFullYear(), newEndDate.getMonth() + 1, 0);
  }

  static onFirstDay(newStartDate: Date): Date {
    return new Date(newStartDate.getFullYear(), newStartDate.getMonth(), 1);
  }
}
