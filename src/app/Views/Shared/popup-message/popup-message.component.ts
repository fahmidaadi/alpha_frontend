import { Component, OnInit } from '@angular/core';
import { PopupMessageService } from '../../../Services/popup-message.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-popup-message',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './popup-message.component.html',
  styleUrl: './popup-message.component.css'
})
export class PopupMessageComponent implements OnInit {
  message: string | null = null;
  type: 'success' | 'error' | null = null;
  visible: boolean = false;

  constructor(private popupMessageService: PopupMessageService) {}

  ngOnInit(): void {
    this.popupMessageService.popupMessage$.subscribe(({ message, type }) => {
      this.message = message;
      this.type = type;
      this.visible = true;
      setTimeout(() => {
        this.visible = false;
        this.message = null;
        this.type = null;
      }, 5000);
    });
  }
}
