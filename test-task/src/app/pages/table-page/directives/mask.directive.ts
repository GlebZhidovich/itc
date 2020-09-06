import { Directive, ElementRef, HostListener, Input, OnInit } from '@angular/core';

@Directive({
  selector: '[appMask]'
})
export class MaskDirective implements OnInit {

  @Input() appMask;
  @Input() control;

  constructor(private elementRef: ElementRef) {
  }

  @HostListener('keydown', ['$event']) onKeyDown(event) {

    if (this.elementRef.nativeElement.value.includes('_') &&
      parseInt(event.key, 10)
    ) {
      this.elementRef.nativeElement.value =
        this.control.get('phone').value =
          this.control.get('phone').value.replace('_', event.key);
    }
    if (event.key === 'Backspace') {
      this.elementRef.nativeElement.value =
      this.control.get('phone').value =
        this.control.get('phone').value
        .split('').reverse().join('').replace(/\d/, '_').split('').reverse().join('');
    }
    event.preventDefault();
  }

  ngOnInit() {
    if (this.control.get('phone').value === '') {
      this.elementRef.nativeElement.value = this.control.get('phone').value = this.appMask;
    }
  }
}
