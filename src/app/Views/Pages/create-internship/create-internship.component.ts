import { Component, OnDestroy } from '@angular/core';
import { FileUploaderComponent } from '../../Components/file-uploader/file-uploader.component';
import { FileUploadService } from '../../../Services/file-upload.service';
import { CommonModule } from '@angular/common'; // Import CommonModule



@Component({
  selector: 'app-create-internship',
  standalone: true,
  imports: [FileUploaderComponent , CommonModule],
  templateUrl: './create-internship.component.html',
  styleUrl: './create-internship.component.css'
})
export class CreateInternshipComponent {
 constructor (public fileUploadService : FileUploadService){}


}
