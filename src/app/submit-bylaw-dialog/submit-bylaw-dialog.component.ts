import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import Swal from 'sweetalert2';
import { environment } from '../../environments/environment';
import { Bylaw } from '../bylaw';

@Component({
  selector: 'app-submit-bylaw-dialog',
  templateUrl: './submit-bylaw-dialog.component.html',
  styleUrl: './submit-bylaw-dialog.component.css'
})
export class SubmitBylawDialogComponent {

  private fileToUpload: File | null = null;

  public bylawYear = -1;
  public isUploading = false;

  constructor(public dialogRef: MatDialogRef<SubmitBylawDialogComponent>) { }

  onNoClick(): void {
    this.dialogRef.close();
  }

  getMissingBylawsYears(): number[] {
    return Bylaw.getMissingBylawsYears();
  }

  bylawButtonClass(year: number): string {
    return this.bylawYear === year ? 'btn btn-primary' : 'btn btn-danger pointer';
  }

  selectBylaw(year: number) {
    this.bylawYear = year;
  }

  handleFileInput(event: Event) {
    this.fileToUpload = (event.target as HTMLInputElement).files?.item(0) ?? null;
  }

  async submit() {
    if (this.bylawYear === -1) {
      Swal.fire({ title: 'Data Error!', text: 'You must choose a year first!', icon: 'error' });
    } else if (this.fileToUpload === null) {
      Swal.fire({ title: 'Data Error!', text: 'You must choose a PDF file first!', icon: 'error' });
    } else {
      const base64Pdf = await this.toBase64(this.fileToUpload);
      if (base64Pdf.startsWith('data:application/pdf')) {
        this.isUploading = true;
        this.uploadBylaw(base64Pdf).then(() => {
          Swal.fire({
            title: 'Bylaw submitted for review!',
            text: this.bylawYear + ' bylaw will be available soon.',
            icon: 'success',
          }).then(() => {
            location.reload();
          });
          this.dialogRef.close();
        }).catch(error => {
          console.error(error);
        });
      } else {
        Swal.fire({ title: 'Not a PDF file!', text: 'Please select a PDF file.', icon: 'error' });
      }
    }
  }

  toBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  }

  uploadBylaw(base64Pdf: string): Promise<any> {
    return fetch(`${environment.apiBaseUrl}/SubmitBylaw`, {
      method: 'POST',
      headers: {
        'Bylaw-Year': '' + this.bylawYear,
        'Content-Type': 'application/pdf;base64'
      },
      body: base64Pdf
    }).then(response => response.json());
  }
}
