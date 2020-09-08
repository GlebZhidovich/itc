import { Directive, ElementRef, HostListener, Input, OnInit } from '@angular/core';

@Directive({
  selector: '[appMask]'
})
export class MaskDirective implements OnInit {

  @Input() appMask;
  @Input() formControlName;
  @Input() control;
  private mask;

  constructor(private elementRef: ElementRef) {
  }

  @HostListener('keydown', ['$event'])
  onKeyDown(event) {
    event.preventDefault();
  }

  @HostListener('keyup', ['$event'])
  @HostListener('click', ['$event'])
  onChange(event) {
    const field = this.elementRef.nativeElement;
    if (event instanceof KeyboardEvent) {
      if (/\d/.test(event.key)) {
        this.addChar(event.key);
      }
      if (['ArrowRight', 'ArrowLeft'].includes(event.key)) {
        this.movePointer(event.key);
      }
      if (['Backspace', 'Delete'].includes(event.key)) {
        this.delChar(event.key);
      }
    }
  }

  addChar(char: string): void {
    const field = this.elementRef.nativeElement;
    const start = field.selectionStart;
    const end = field.selectionEnd;
    const curPos = start < end ? start : end;
    if (this.mask.length > field.value.length) {
      const arr = field.value.split('');
      arr.splice(curPos, 0, char);
      const newVal = arr.join('');
      this.applyMask(newVal);
      this.posPointer(curPos);
    }
  }

  delChars(value: string, start: number, end: number): string {
    const arr = value.split('');
    arr.splice(start, end - start);
    return arr.join('');
  }

  notEqualPoints(field: HTMLInputElement): void {
    let newVal: string;
    const start = field.selectionStart;
    const end = field.selectionEnd;
    if (start < end) {
      newVal = this.delChars(field.value, start, end);
    } else {
      newVal = this.delChars(field.value, end, start);
    }
    this.applyMask(newVal);
    start < end ? this.posPointer(start) : this.posPointer(end);
  }

  equalPoints(type: string, field: HTMLInputElement): void {
    let index = field.selectionStart;
    let newVal: string;
    if (type === 'Backspace') {
      newVal = field.value.split('').reverse().filter((char, i) => {
        if ((field.value.length - 1 - index === i - 1) &&
          /\D/.test(char)) {
          if (index !== 0) {
            index -= 1;
          }
          return true;
        }
        return !(field.value.length - 1 - index === i - 1);
      }).reverse().join('');
    } else {
      newVal = field.value.split('').filter((char, i) => {
        if (index === i &&
          /\D/.test(char)) {
          if (index !== 0) {
            index += 1;
          }
          return true;
        }
        return !(index === i);
      }).join('');
    }
    this.applyMask(newVal);
    type === 'Backspace' ? this.posPointer(index - 1) : this.posPointer(index);
  }

  delChar(type: string): void {
    const field = this.elementRef.nativeElement;
    const start = field.selectionStart;
    const end = field.selectionEnd;
    if (start === end) {
      this.equalPoints(type, field);
    } else {
      this.notEqualPoints(field);
    }
  }

  posPointer(val: number) {
    const field = this.elementRef.nativeElement;
    field.selectionStart = field.selectionEnd = val;
  }

  movePointer(type: string): void {
    const field = this.elementRef.nativeElement;
    const start = field.selectionStart;
    if (type === 'ArrowRight') {
      this.posPointer(start + 1);
    } else {
      this.posPointer(start - 1);
    }
  }

  applyMask(data: string): void {
    const field = this.elementRef.nativeElement;
    const arr = data.split('').filter(char => /\d/.test(char));
    let newVal = this.mask.map((char) => {
      if (char !== '_') {
        return char;
      }
      if (data.length === 0) {
        return char;
      }
      return arr.shift();
    }).filter(char => {
      return char !== '_';
    })
      .join('');
    if (!/\d/.test(newVal[newVal.length - 1])) {
      const arrNum = newVal.match(/\d/gi);
      if (arrNum) {
        const index = newVal.lastIndexOf(arrNum[arrNum.length - 1]);
        newVal = newVal.substring(0, index + 1);
      } else {
        newVal = '';
      }
    }
    this.control.get(this.formControlName).setValue(newVal);
  }

  ngOnInit() {
    this.mask = this.appMask.split('');
  }
}
