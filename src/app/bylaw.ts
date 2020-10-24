enum BylawStatus {
  AVAILABLE = "AVAILABLE",
  COMING_SOON = "COMING_SOON",
  NOT_AVAILABLE = "NOT_AVAILABLE"
}

export class Bylaw {
  private static allBylaws: {[year: number]: Bylaw} = {};

  public year: string;
  public status: BylawStatus;

  public static loadBylaws(existingBylaws: Bylaw[]) {
    console.log(existingBylaws);
    let today = new Date();
    let maxYear = today.getMonth() >= 9? today.getFullYear() + 5 : today.getFullYear() + 4;
    for (var year = 2019; year <= maxYear; year++) {
      let bylawInitData = {
        "Year": ""+year,
        "Status": "NOT_AVAILABLE"
      }
      Bylaw.allBylaws[year] = new Bylaw(bylawInitData);
    }
    for (let bylaw of existingBylaws) {
      Bylaw.allBylaws[parseInt(bylaw.year)] = bylaw;
    }
    console.log(Bylaw.allBylaws);
  }

  constructor(data: any) {
    this.year = data["Year"];
    this.status = BylawStatus[data["Status"]];
  }

}
