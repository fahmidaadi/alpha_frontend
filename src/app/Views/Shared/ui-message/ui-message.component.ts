import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-ui-message',
  standalone: true,
  imports: [],
  templateUrl: './ui-message.component.html',
  styleUrl: './ui-message.component.css'
})
export class UiMessageComponent {
  @Input() message: string | undefined;

}
