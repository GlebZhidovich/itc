import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { SaveService } from '../../services/save.service';

interface IPersonsInfo {
  id: string;
  fullName: string;
  sex: string;
  birthday: string;
  familyStatus: boolean;
  education: string;
  phone: string;
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

@Component({
  selector: 'app-table-page',
  templateUrl: './table-page.component.html',
  styleUrls: ['./table-page.component.scss']
})
export class TablePageComponent implements OnInit {

  public fields: FormArray;

  constructor(private saveService: SaveService) {
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
    const pattern = {
      id: '',
      fullName: '',
      sex: '',
      birthday: '',
      familyStatus: '',
      education: '',
      phone: '',
      isEdit: true
    };
    const group = this.toGroup(pattern);
    this.fields.insert(index + 1, group);
  }

  onEditData(index: number): void {
    this.fields.controls[index].get('isEdit').setValue(true);
  }

  onSaveData(index: number): void {
    if (this.fields.controls[index].valid) {
      this.fields.controls[index].get('isEdit').setValue(false);
    }
  }

  toEditable(person) {
    return {...person, isEdit: false};
  }

  toControl(value, validators?) {
    if (validators) {
      return new FormControl(value, validators);
    }
    return new FormControl(value);
  }

  toGroup(person): FormGroup {
    const validators = {
      id: [Validators.required,
        Validators.minLength(1),
        Validators.maxLength(10)],
      fullName: [Validators.required,
        Validators.minLength(6)],
      sex: [Validators.required],
      birthday: [Validators.required],
      familyStatus: [Validators.required],
      education: [Validators.required],
    };
    const newPerson = {...person};
    for ( const key in newPerson ) {
      if (typeof newPerson[key] === 'string' ||
      typeof newPerson[key] === 'boolean') {
        if (validators[key]) {
          newPerson[key] = this.toControl(newPerson[key], validators[key]);
        } else {
          newPerson[key] = this.toControl(newPerson[key]);
        }
      }
    }
    return new FormGroup(newPerson);
  }

  onSubmit() {
    if (this.fields.valid) {
      const data = this.fields.value
        .map(group => {
          delete group.isEdit;
          return group;
        });
      this.saveService.onSaveData(data);
    }
  }
}


