import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-confirm-button',
  standalone: true,
  imports: [],
  templateUrl: './confirm-button.component.html',
  styleUrl: './confirm-button.component.css'
})
export class ConfirmButtonComponent {
  @Input() disabled: boolean | null= false;
  

}
