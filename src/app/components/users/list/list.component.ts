import {Component, input, OnInit, output, signal} from '@angular/core';
import {DataService} from "../../../services/data.service";
import {User} from "../../../services/users";
import {
  MatCell,
  MatCellDef,
  MatColumnDef,
  MatHeaderCell,
  MatHeaderCellDef,
  MatHeaderRow, MatHeaderRowDef, MatRow, MatRowDef,
  MatTable
} from "@angular/material/table";
import {distinctUntilChanged, filter, finalize} from "rxjs";
import {MatProgressSpinner} from "@angular/material/progress-spinner";
import {MatPaginator, MatPaginatorIntl, MatPaginatorModule, PageEvent} from "@angular/material/paginator";
import {toObservable} from "@angular/core/rxjs-interop";
import {SelectionModel} from "@angular/cdk/collections";
import {MatCheckbox} from "@angular/material/checkbox";
import {DatePipe, NgOptimizedImage, NgTemplateOutlet} from "@angular/common";
import {PaginatorIntl} from "../../../i18n/paginator-intl";
import {MatCard} from "@angular/material/card";
import {MatIcon} from "@angular/material/icon";
import {MatMiniFabButton} from "@angular/material/button";

@Component({
  selector: 'app-list',
  standalone: true,
  imports: [MatTable, MatColumnDef, MatHeaderCell, MatCell, MatCellDef, MatHeaderCellDef, MatHeaderRow, MatRow, MatHeaderRowDef, MatRowDef, MatProgressSpinner, MatPaginator, MatPaginatorModule, MatCheckbox, NgTemplateOutlet, MatCard, MatIcon, MatMiniFabButton, DatePipe, NgOptimizedImage],
  templateUrl: './list.component.html',
  styleUrl: './list.component.scss',
  providers: [{provide: MatPaginatorIntl, useClass: PaginatorIntl}],
})
export class ListComponent implements OnInit{

  displayedColumns: string[] = [
    'actions',
    'username',
    'email',
    'phone',
    'role',
    'updatedAt',
    'createdAt',
    'status',
    'hasEp',
  ];

  users = input.required<User[]>();
  paginatedUsers = signal<User[]>([]);
  page = signal<number>(0);
  pageSize = signal<number>(5);
  isLoading = input<boolean>();

  selection = new SelectionModel<User>(true, []);
  selectionChange = output<User[]>();

  constructor() {
    toObservable(this.users).pipe(
      filter(Boolean),
    ).subscribe(() => {
      this.selection.clear();
      this.page.set(0);
      this.paginatedUsers.set(this.users().slice(0, this.pageSize()))
    });

    toObservable(this.pageSize).pipe(
      distinctUntilChanged(),
    ).subscribe(pageSize => {
      const offset = this.page() * pageSize;
      this.paginatedUsers.set(this.users().slice(offset, offset + pageSize));
    });

    toObservable(this.page).pipe(
      distinctUntilChanged(),
    ).subscribe(page => {
      const offset = this.pageSize() * page;
      this.paginatedUsers.set(this.users().slice(offset, offset + this.pageSize()));
      this.selection.clear();
    })
  }

  ngOnInit() {
    this.selection.changed.subscribe(data => {
      this.selectionChange.emit(data.source.selected);
    });
  }

  isAllSelected(): boolean {
    const numSelected = this.selection.selected.length;
    const numRows = this.paginatedUsers().length;
    return numSelected === numRows;
  }

  toggleAllRows(): void {
    if (this.isAllSelected()) {
      this.selection.clear();
      return;
    }
    this.selection.select(...this.paginatedUsers());
  }

  handlePageChange(pageEvent: PageEvent): void {
    this.pageSize.set(pageEvent.pageSize);
    this.page.set(pageEvent.pageIndex);
  }
}
