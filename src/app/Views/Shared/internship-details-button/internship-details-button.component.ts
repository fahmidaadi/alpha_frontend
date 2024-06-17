import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-internship-details-button',
  standalone: true,
  imports: [],
  templateUrl: './internship-details-button.component.html',
  styleUrl: './internship-details-button.component.css'
})
export class InternshipDetailsButtonComponent {

  @Input() label: string = '';
  @Output() buttonClick = new EventEmitter<void>();
  
  handleClick() {
    this.buttonClick.emit();
  }

}
