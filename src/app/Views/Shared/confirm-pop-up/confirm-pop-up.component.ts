import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-confirm-pop-up',
  standalone: true,
  imports: [],
  templateUrl: './confirm-pop-up.component.html',
  styleUrl: './confirm-pop-up.component.css'
})
export class ConfirmPopUpComponent {
  @Input() studentName!: string;
  @Output() onConfirm = new EventEmitter<boolean>();

  confirmDelete(confirmed: boolean) {
    this.onConfirm.emit(confirmed);
  }
}
