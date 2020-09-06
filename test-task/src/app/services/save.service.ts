import { Injectable } from '@angular/core';
import { from } from 'rxjs';
import { delay, reduce } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class SaveService {

  constructor() { }

  onSaveData(data) {
    from(data)
      .pipe(
        delay(2000),
        reduce((acc, val) => {
          acc.push(val);
          return acc;
        }, []),
      )
      .subscribe({
        next: (obj) => {
          console.log(obj);
        },
        error: (err) => {
          console.log(err);
        }
      });
  }
}
