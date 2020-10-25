import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Bylaw } from '../bylaw'

import * as _swal from 'sweetalert';
import { SweetAlert } from 'sweetalert/typings/core';
const swal: SweetAlert = _swal as any;

@Component({
  selector: 'app-submit-bylaw-dialog',
  templateUrl: './submit-bylaw-dialog.component.html',
  styleUrls: ['./submit-bylaw-dialog.component.css']
})
export class SubmitBylawDialogComponent implements OnInit {

  private fileToUpload: File = null;

  public bylawYear: number = -1;
  public isUploading: boolean = false;

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

  async submit() {
    if (this.bylawYear == -1) {
      swal({
        title: "Data Error!",
        text: "You must choose a year first!",
        icon: "error",
      });
    } else if (this.fileToUpload == null || this.fileToUpload == undefined) {
      swal({
        title: "Data Error!",
        text: "You must choose a PDF file first!",
        icon: "error",
      });
    } else {
      var base64Pdf = await this.toBase64(this.fileToUpload);
      if (base64Pdf.startsWith("data:application/pdf")) {
        this.isUploading = true;
        this.uploadBylaw(base64Pdf).then(response => {
          swal({
            title: "Bylaw submitted for review!",
            text: this.bylawYear + " bylaw will be available soon.",
            icon: "success",
          }).then( _ => {
            location.reload();
          })
          this.dialogRef.close();
        }).catch(error => {
          console.error(error)
        })
      } else {
        swal({
          title: "Not a PDF file!",
          text: "Please select a PDF file.",
          icon: "error",
        });
      }
    }
  }

  toBase64(file): Promise {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
  }

  uploadBylaw(base64Pdf: string): Promise {
    return fetch("https://jc903eqh55.execute-api.eu-west-1.amazonaws.com/prod/SubmitBylaw", {
      method: 'Post',
      headers: {
        'Bylaw-Year': this.bylawYear,
        'Content-Type': 'application/pdf;base64'
      },
      body: base64Pdf
    }).then(response => {
      return response.json();
    }).catch(error => {
      console.error(error);
    })
  }

}
