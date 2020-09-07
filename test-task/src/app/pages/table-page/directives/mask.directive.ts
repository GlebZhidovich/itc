import { Directive, ElementRef, HostListener, Input, OnInit } from '@angular/core';

@Directive({
  selector: '[appMask]'
})
export class MaskDirective implements OnInit{

  @Input() appMask;
  private mask;

  constructor(private elementRef: ElementRef) {
  }

  @HostListener('keyup')
  @HostListener('click') onChange() {
    console.log('change');
    const field = this.elementRef.nativeElement;
    const oldStart = field.selectionStart;
    const oldEnd = field.selectionEnd;

    field.value = this.reapplyMask(field.value);

    field.selectionStart = oldStart;
    field.selectionEnd = oldEnd;
  }

  applyMask(data) {
    return this.mask.map(function(char) {
      if (char !== '_') { return char; }
      if (data.length === 0) { return char; }
      return data.shift();
    }).join('');
  }

  reapplyMask(data) {
    return this.applyMask(this.stripMask(data));
  }

  stripMask(maskedData) {
    function isDigit(char) {
      return /\d/.test(char);
    }
    return maskedData.split('').filter(isDigit);
  }

  ngOnInit() {
    this.mask = this.appMask.split('');
  }
}
