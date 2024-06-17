import { Component, ElementRef, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfirmButtonComponent } from '../../Shared/confirm-button/confirm-button.component';
import { FileUploadService } from '../../../Services/file-upload.service';

@Component({
  selector: 'app-file-uploader',
  standalone: true,
  imports: [ConfirmButtonComponent],
  templateUrl: './file-uploader.component.html',
  styleUrl: './file-uploader.component.css'
})
export class FileUploaderComponent {

  constructor(private fileUploadService : FileUploadService ){}

   onConfirmClick(){
    this.fileUploadService.setShowFileUploader(false);
    console.log('Confirm button clicked!');


   }

}



