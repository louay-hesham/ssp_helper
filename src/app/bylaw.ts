enum BylawStatus {
  AVAILABLE = "AVAILABLE",
  COMING_SOON = "COMING_SOON",
  NOT_AVAILABLE = "NOT_AVAILABLE"
}

export class Bylaw {
  private static allBylaws: {[year: string]: Bylaw} = {};

  public year: string;
  public status: BylawStatus;
  public statusStr: string;

  public static loadBylaws(bylaws: Bylaw[]) {
    Bylaw.allBylaws = bylaws;
  }

  constructor(data: any) {
    console.log(data);
    this.year = data["Year"];
    // this.statusStr = data["Status"];
    this.status = BylawStatus[data["Status"]];
  }
}
