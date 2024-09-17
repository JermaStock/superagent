import {Component, inject, OnInit, output, signal} from '@angular/core';
import {MatCard, MatCardContent} from "@angular/material/card";
import {
  FormControl,
  FormGroupDirective,
  FormsModule, NgForm,
  ReactiveFormsModule,
  UntypedFormBuilder,
  Validators
} from "@angular/forms";
import {MatError, MatFormField, MatHint, MatLabel, MatPrefix, MatSuffix} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {MatIcon} from "@angular/material/icon";
import {MatButton, MatIconButton} from "@angular/material/button";
import {MatDatepicker, MatDatepickerInput, MatDatepickerToggle} from "@angular/material/datepicker";
import {ErrorStateMatcher, MatOption, provideNativeDateAdapter} from "@angular/material/core";
import {MatSelect} from "@angular/material/select";
import {User} from "../../../services/users";
import {NgxMaskDirective} from "ngx-mask";

@Component({
  selector: 'app-filters',
  standalone: true,
  imports: [MatCard, MatCardContent, ReactiveFormsModule, MatFormField, FormsModule, MatInput, MatLabel, MatIcon, MatIconButton, MatSuffix, MatPrefix, MatDatepickerInput, MatDatepicker, MatDatepickerToggle, MatHint, MatSelect, MatOption, MatButton, MatError, NgxMaskDirective],
  templateUrl: './filters.component.html',
  styleUrl: './filters.component.scss',
  providers: [provideNativeDateAdapter()],
})
export class FiltersComponent implements OnInit {

  private readonly fb = inject(UntypedFormBuilder);

  filters = this.fb.group({
    username: [null, this.customValidator],
    phone: [null, Validators.maxLength(11)],
    email: [null, Validators.email],
    status: ['Active'],
    role: ['User'],
    createdAt: [null],
    updatedAt: [null],
  });

  statuses = [
    { value: 'Active', viewValue: 'Активен' },
    { value: 'Blocked', viewValue: 'Заблокирован' },
  ];

  roles = [
    { value: 'User', viewValue: 'Пользователь' },
    { value: 'Admin', viewValue: 'Администратор' },
  ];

  isEmailError = signal<boolean>(false);

  filtersChange = output<User>();
  clearFilterChange = output<boolean>();

  constructor() {
  }

  get username() {
    return this.filters.get('username')?.value
  }

  set username(value: string) {
    this.filters.get('username')?.patchValue(value);
  }

  get phone() {
    return this.filters.get('phone')?.value
  }

  set phone(value: string) {
    this.filters.get('phone')?.patchValue(value);
  }

  get email() {
    return this.filters.get('email')?.value
  }

  set email(value: string) {
    this.filters.get('email')?.patchValue(value);
  }

  get createdAt() {
    return this.filters.get('createdAt')?.value
  }

  set createdAt(value: string) {
    this.filters.get('createdAt')?.patchValue(value);
  }

  get updatedAt() {
    return this.filters.get('updatedAt')?.value
  }

  set updatedAt(value: string) {
    this.filters.get('updatedAt')?.patchValue(value);
  }

  ngOnInit() {
    this.filters.valueChanges.subscribe(data => {
      console.log(data);
    })
  }

  customValidator(control: any) {
    const pattern = /^[a-zA-Z0-9]*$/;
    return pattern.test(control.value) ? null : { invalidCharacters: true };
  }


  applyFilters() {
    this.filtersChange.emit(this.filters.value);
  }

  clearFilter(shouldClearFilter: boolean) {
    if (shouldClearFilter) {
      this.username = this.email = this.updatedAt = this.createdAt = this.phone = '';
    }
    this.clearFilterChange.emit(true);
  }
}
