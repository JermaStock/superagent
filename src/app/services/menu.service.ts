import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MenuService {

  isOpen: boolean = false;

  constructor() { }
}
