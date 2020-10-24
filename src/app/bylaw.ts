export enum BylawStatus {
  AVAILABLE = "AVAILABLE",
  COMING_SOON = "COMING_SOON",
  NOT_AVAILABLE = "NOT_AVAILABLE"
}

export class Bylaw {
  private static allBylaws: {[year: number]: Bylaw} = {};

  public year: string;
  public status: BylawStatus;

  public static loadBylaws(existingBylaws: Bylaw[]) {
    for (let bylaw of existingBylaws) {
      Bylaw.allBylaws[parseInt(bylaw.year)] = bylaw;
    }
  }

  public static getAllBylaws(): Bylaw[] {
    return Bylaw.getAllYears().map(year => Bylaw.allBylaws[year])
  }

  public static getAllYears(): string[] {
    return Object.keys(Bylaw.allBylaws)
  }

  public static getMissingBylawsYears(): number[] {
    let today = new Date();
    let maxYear = today.getMonth() >= 9? today.getFullYear() + 5 : today.getFullYear() + 4;
    let years = []
    for (var year = 2019; year <= maxYear; year++) {
      if (!(year in Bylaw.allBylaws)) {
        years.push(year);
      }
    }
    return years;
  }

  constructor(data: any) {
    this.year = data["Year"];
    this.status = BylawStatus[data["Status"]];
  }

}
