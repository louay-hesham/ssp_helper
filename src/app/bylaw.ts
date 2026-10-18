export enum BylawStatus {
  AVAILABLE = 'AVAILABLE',
  COMING_SOON = 'COMING_SOON',
  NOT_AVAILABLE = 'NOT_AVAILABLE'
}

export class Bylaw {
  private static allBylaws: { [year: number]: Bylaw } = {};

  public year: string;
  public status: BylawStatus;

  public static loadBylaws(existingBylaws: Bylaw[]) {
    for (const bylaw of existingBylaws) {
      Bylaw.allBylaws[parseInt(bylaw.year, 10)] = bylaw;
    }
  }

  public static getAllBylaws(): Bylaw[] {
    return Bylaw.getAllYears().map(year => Bylaw.allBylaws[parseInt(year, 10)]);
  }

  public static getAllYears(): string[] {
    return Object.keys(Bylaw.allBylaws);
  }

  public static getMissingBylawsYears(): number[] {
    const today = new Date();
    const maxYear = today.getMonth() >= 9 ? today.getFullYear() + 5 : today.getFullYear() + 4;
    const years: number[] = [];
    for (let year = 2019; year <= maxYear; year++) {
      if (!(year in Bylaw.allBylaws)) {
        years.push(year);
      }
    }
    return years;
  }

  constructor(data: { Year: string; Status: keyof typeof BylawStatus }) {
    this.year = data.Year;
    this.status = BylawStatus[data.Status];
  }
}
