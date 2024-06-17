  import { ApplicationRef, ComponentFactoryResolver, ComponentRef, Injectable, Injector } from '@angular/core';
import { ConfirmPopUpComponent } from '../Views/Shared/confirm-pop-up/confirm-pop-up.component';

@Injectable({
  providedIn: 'root'
})
export class DialogService {

  constructor(
    private componentFactoryResolver: ComponentFactoryResolver,
    private appRef: ApplicationRef,
    private injector: Injector
  ) { }


  showConfirmDialog(studentName: string): Promise<boolean> {
    return new Promise((resolve) => {
      const componentRef = this.createComponent(ConfirmPopUpComponent);
      componentRef.instance.studentName = studentName;
      componentRef.instance.onConfirm.subscribe((confirmed: boolean) => {
        this.appRef.detachView(componentRef.hostView);
        componentRef.destroy();
        resolve(confirmed);
      });
    });
  }

  private createComponent(component: any): ComponentRef<any> {
    const factory = this.componentFactoryResolver.resolveComponentFactory(component);
    const componentRef = factory.create(this.injector);
    this.appRef.attachView(componentRef.hostView);
    const domElem = (componentRef.hostView as any).rootNodes[0] as HTMLElement;
    document.body.appendChild(domElem);
    return componentRef;
  }
}
