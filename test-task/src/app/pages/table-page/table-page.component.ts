import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { reduce, map } from 'rxjs/operators';
import { DataService, IPersonsInfo } from '../../services/data.service';

@Component({
  selector: 'app-table-page',
  templateUrl: './table-page.component.html',
  styleUrls: ['./table-page.component.scss']
})
export class TablePageComponent implements OnInit, OnDestroy {

  public fields: FormArray;
  private mapPerson$: Subscription;

  constructor(private dataService: DataService) {
  }

  onDeleteData(index: number): void {
    this.fields.removeAt(index);
  }

  onAddData(index: number): void {
    const pattern: IPersonsInfo = {
      id: '',
      fullName: '',
      sex: '',
      birthday: '',
      familyStatus: false,
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

  toEditable(person: IPersonsInfo): IPersonsInfo {
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
      phone: [Validators.required],
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

  onSubmit(): void {
    if (this.fields.valid) {
      const data: IPersonsInfo[] = this.fields.value
        .map((group: IPersonsInfo) => {
          delete group.isEdit;
          return group;
        });
      this.dataService.onSaveData(data);
    }
  }


  ngOnInit() {
    this.mapPerson$ = this.dataService.onLoadData()
      .pipe(
        map(person => this.toEditable(person)),
        map(person => this.toGroup(person)),
        reduce((acc, obj) => {
          acc.push(obj);
          return acc;
        }, [])
      )
      .subscribe({
        next: (data: FormGroup[]) => {
          this.fields = new FormArray(data);
        },
        error: err => console.log(err)
      });
  }

  ngOnDestroy() {
    this.mapPerson$.unsubscribe();
  }
}


