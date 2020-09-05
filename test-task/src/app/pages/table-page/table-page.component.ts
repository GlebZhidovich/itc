import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup } from '@angular/forms';

interface IPersonsInfo {
  id: number;
  fullName: string;
  sex: string;
  birthday: string;
  familyStatus: string;
  education: string;
  phone: string;
}

const personsInfo: IPersonsInfo[] = [
  {
    id: 1,
    fullName: 'Gleb Zhidovich',
    sex: 'male',
    birthday: '13.09.1992',
    familyStatus: 'single',
    education: 'BNTU',
    phone: '5925520'
  },
  {
    id: 2,
    fullName: 'Zina Zhidovich',
    sex: 'female',
    birthday: '13.09.1992',
    familyStatus: 'single',
    education: 'BNTU',
    phone: '5925526'
  }
];

@Component({
  selector: 'app-table-page',
  templateUrl: './table-page.component.html',
  styleUrls: ['./table-page.component.scss']
})
export class TablePageComponent implements OnInit {

  public fields: FormArray;

  constructor() {
  }

  ngOnInit() {
    // this.fields = new FormArray([
    //   new FormGroup({
    //     id: new FormControl(1),
    //     fullName: new FormControl('Gleb Zhidovich'),
    //     sex: new FormControl('male'),
    //     birthday: new FormControl('13.09.1992'),
    //     familyStatus: new FormControl('single'),
    //     education: new FormControl('BNTU'),
    //     phone: new FormControl('5925520'),
    //   })
    // ]);
    const mapPerson = personsInfo
      .map(toGroup);

    this.fields = new FormArray(mapPerson);
    console.log(personsInfo);
  }

}

function toControl(value) {
  return new FormControl(value);
}

function toGroup(person): FormGroup {
  const newPerson = Object.assign({}, person);
  for ( const key in newPerson ) {
    if (newPerson[key]) {
      newPerson[key] = toControl(newPerson[key]);
    }
  }
  return new FormGroup(newPerson);
}
