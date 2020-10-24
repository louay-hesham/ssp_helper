import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Bylaw } from '../bylaw'

@Component({
  selector: 'app-submit-bylaw-dialog',
  templateUrl: './submit-bylaw-dialog.component.html',
  styleUrls: ['./submit-bylaw-dialog.component.css']
})
export class SubmitBylawDialogComponent implements OnInit {

  private fileToUpload: File = null;

  public bylawYear: number = -1;

  constructor(public dialogRef: MatDialogRef<SubmitBylawDialogComponent>) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

  ngOnInit() {
  }

  getMissingBylawsYears(): number[] {
    return Bylaw.getMissingBylawsYears();
  }

  bylawButtonClass(year: number): string {
    var css: string;
  	if (this.bylawYear == year) {
  		css = "btn btn-primary";
  	} else {
  		css = "btn btn-danger pointer";
  	}
    return css;
  }

  bylawButtonDisability(year: number): string {
  	if (this.bylawYear == year) {
  		return "disabled";
  	} else {
  		return ""
  	}
  }

  selectBylaw(year: number) {
    this.bylawYear = year;
  }

  handleFileInput(files: FileList) {
    this.fileToUpload = files.item(0);
  }

  submit() {
    if (this.bylawYear == -1) {
      alert("You must choose a year first!")
    } else if (this.fileToUpload == null || this.fileToUpload == undefined) {
      alert("You must choose a PDF file first!")
    } else {
      console.log(this.bylawYear);
      console.log(this.fileToUpload);
    }
  }

}
