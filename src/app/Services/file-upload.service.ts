import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FileUploadService {
  
  private showFileUploader: boolean = true;

  constructor() {}

  getShowFileUploader(): boolean {
    return this.showFileUploader;
  }

  setShowFileUploader(showUploader: boolean): void {
    this.showFileUploader = showUploader;
  }
}
