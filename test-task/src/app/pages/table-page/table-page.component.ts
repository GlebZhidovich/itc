import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';

interface IPersonsInfo {
  id: number;
  fullName: string;
  sex: string;
  birthday: string;
  familyStatus: boolean;
  education: string;
  phone: string;
}

const personsInfo: IPersonsInfo[] = [
  {
    id: 1,
    fullName: 'Gleb Zhidovich',
    sex: 'муж',
    birthday: '1992-09-09',
    familyStatus: true,
    education: 'БНТУ',
    phone: '(33) 5233326'
  },
  {
    id: 2,
    fullName: 'Zina Zhidovich',
    sex: 'жен',
    birthday: '1992-09-09',
    familyStatus: false,
    education: 'БГУИР',
    phone: '(33) 5233326'
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
    const mapPerson = personsInfo
      .map(person => this.toEditable(person))
      .map(person => this.toGroup(person));

    this.fields = new FormArray(mapPerson);
  }

  onDeleteData(index: number): void {
    this.fields.removeAt(index);
  }

  onAddData(index: number): void {
    const group = new FormGroup({
      id: new FormControl(''),
      fullName: new FormControl(''),
      sex: new FormControl(''),
      birthday: new FormControl(''),
      familyStatus: new FormControl(''),
      education: new FormControl(''),
      phone: new FormControl(''),
      isEdit: new FormControl(true),
    });
    this.fields.insert(index + 1, group);
  }

  onEditData(index: number): void {
    this.fields.controls[index].get('isEdit').setValue(true);
  }

  onSaveData(index: number): void {
    this.fields.controls[index].get('isEdit').setValue(false);
  }

  toEditable(person) {
    return {...person, isEdit: false};
  }

  toControl(value) {
    return new FormControl(value);
  }

  toGroup(person): FormGroup {
    const newPerson = {...person};
    for ( const key in newPerson ) {
      if (newPerson[key] ||
      typeof newPerson[key] === 'boolean') {
        newPerson[key] = this.toControl(newPerson[key]);
      }
    }
    return new FormGroup(newPerson);
  }

}


