import { Injectable } from '@angular/core';
import { from, of } from 'rxjs';
import { delay } from 'rxjs/operators';

export interface IPersonsInfo {
  id: string;
  fullName: string;
  sex: string;
  birthday: string;
  familyStatus: boolean;
  education: string;
  phone: string;
  isEdit?: boolean;
}

const personsInfo: IPersonsInfo[] = [
  {
    id: '1',
    fullName: 'Gleb Zhidovich',
    sex: 'муж',
    birthday: '1992-09-09',
    familyStatus: true,
    education: 'БНТУ',
    phone: '(33) 5233326'
  },
  {
    id: '2',
    fullName: 'Zina Zhidovich',
    sex: 'жен',
    birthday: '1992-09-09',
    familyStatus: false,
    education: 'БГУИР',
    phone: '(33) 5233326'
  }
];

@Injectable({
  providedIn: 'root'
})
export class DataService {

  onLoadData() {
    return from(personsInfo);
  }

  onSaveData(data: IPersonsInfo[]): void {
    of(data)
      .pipe(
        delay(2000),
      )
      .subscribe({
        next: (obj: IPersonsInfo[]) => {
          const info = JSON.stringify(obj);
          console.log(info);
        },
        error: (err) => {
          console.log(err);
        }
      });
  }
}
