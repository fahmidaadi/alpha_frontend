import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

interface PopupMessage {
  message: string;
  type: 'success' | 'error';
}


@Injectable({
  providedIn: 'root'
})
export class PopupMessageService {

  private popupMessageSource = new Subject<PopupMessage>();
  popupMessage$ = this.popupMessageSource.asObservable();

  showPopupMessage(message: string, type: 'success' | 'error'): void {
    this.popupMessageSource.next({ message, type });
  }
}
