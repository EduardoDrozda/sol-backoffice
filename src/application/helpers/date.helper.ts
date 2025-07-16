export abstract class DateHelper {
  static addDays(date: Date, days: number = 1): Date {
    return new Date(date.getTime() + days * 24 * 60 * 60 * 1000); // 24 hours
  }

  static addHours(date: Date, hours: number = 1): Date {
    return new Date(date.getTime() + hours * 60 * 60 * 1000); // 1 hour
  }

  static addMinutes(date: Date, minutes: number = 1): Date {
    return new Date(date.getTime() + minutes * 60 * 1000);
  }
}