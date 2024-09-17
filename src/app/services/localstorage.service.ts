import { Injectable } from '@angular/core';
import {User} from "./users";

@Injectable({
  providedIn: 'root'
})
export class LocalstorageService {

  constructor() { }

  hasUsers(): boolean {
    return Boolean(localStorage.getItem('users'));
  }

  getUsers(): User[] {
    return JSON.parse(localStorage.getItem('users') as string);
  }

  setUsers(users: User[]) {
    localStorage.setItem('users', JSON.stringify(users));
  }
}
