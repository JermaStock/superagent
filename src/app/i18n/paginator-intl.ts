import { Injectable } from '@angular/core';
import {MatPaginatorIntl} from "@angular/material/paginator";
import {Subject} from "rxjs";

@Injectable()
export class PaginatorIntl implements MatPaginatorIntl{

  changes = new Subject<void>();

  firstPageLabel = $localize`Первая страница`;
  itemsPerPageLabel = $localize`Отображать запсией:`;
  lastPageLabel = $localize`Последняя страница`;

  nextPageLabel = 'Следующая страница';
  previousPageLabel = 'Предыдущая страница';

  getRangeLabel(page: number, pageSize: number, length: number): string {
    if (length === 0) {
      return $localize`1 из 1`;
    }
    const pageOffset = pageSize * page;
    const pageOffsetMax = pageOffset + pageSize;
    return $localize`${pageOffset + 1} - ${pageOffsetMax > length ? length : pageOffsetMax} из ${length}`;
  }
}
