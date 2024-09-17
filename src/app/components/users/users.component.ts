import {Component, OnInit, signal} from '@angular/core';
import {FiltersComponent} from "./filters/filters.component";
import {ListComponent} from "./list/list.component";
import {finalize, map, Subject} from "rxjs";
import {DataService} from "../../services/data.service";
import {RoleEnum, StatusEnum, User} from "../../services/users";
import {MatButton, MatFabButton} from "@angular/material/button";
import {MatIcon} from "@angular/material/icon";
import {LocalstorageService} from "../../services/localstorage.service";

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [
    FiltersComponent,
    ListComponent,
    MatButton,
    MatFabButton,
    MatIcon
  ],
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss'
})
export class UsersComponent implements OnInit {

  users: User[] = [];
  filteredUsers: User[] = [];
  filters: User;
  selectedUsers: User[] = [];
  isLoading = signal<boolean>(true);

  showFilters: boolean = true;

  usersSubject = new Subject<User[]>();
  usersSubjectObservable = this.usersSubject.pipe(
    map(users => {
      let filteredUsers = users;

      if (this.filters.username) filteredUsers = filteredUsers.filter(user => user.username.includes(this.filters.username));
      if (this.filters.email) filteredUsers = filteredUsers.filter(user => user.email.includes(this.filters.email));
      if (this.filters.phone) filteredUsers = filteredUsers.filter(user => user.phone.toString().includes(this.filters.phone.toString()));
      if (this.filters.createdAt) filteredUsers = filteredUsers.filter(user => user.createdAt.getTime() === this.filters.createdAt.getTime());
      if (this.filters.updatedAt) filteredUsers = filteredUsers.filter(user => user.updatedAt.getTime() === this.filters.updatedAt.getTime());
      if (this.filters.role) filteredUsers = filteredUsers.filter(user => this.translateEnums(user.role) === this.filters.role);
      if (this.filters.status) filteredUsers = filteredUsers.filter(user => this.translateEnums(user.status) === this.filters.status);

      return filteredUsers;
    }),
  )

  constructor(
    private readonly data: DataService,
    private readonly localStorage: LocalstorageService,
  ) {
  }

  ngOnInit() {
    if (this.localStorage.hasUsers()) {
      this.users = this.filteredUsers = this.localStorage.getUsers();
      this.isLoading.set(false);
    } else {
      this.data.load().pipe(
        finalize(() => this.isLoading.set(false)),
      ).subscribe(users => {
        this.localStorage.setUsers(users);
        this.users = this.filteredUsers = users;
      });
    }

    this.usersSubjectObservable.subscribe(users => this.filteredUsers = users);
  }

  handleFilters(filter: User) {
    this.filters = filter;
    this.usersSubject.next(this.users);
  }

  handleClearFilters() {
    this.filteredUsers = this.users;
  }

  toggleUsersState(isBlocking: boolean) {
    const updatedUsers: User[] = this.users.map((user): User => {
      if (this.selectedUsers.find(selectedUser => selectedUser.id === user.id)) {
        return {
          ...user,
          status: isBlocking ? StatusEnum.Blocked : StatusEnum.Active,
        }
      }

      return user;
    });
    this.filteredUsers = this.filteredUsers.filter(user => {
      if (this.selectedUsers.find(selectedUser => selectedUser.id === user.id)) {
        return {
          ...user,
          status: isBlocking ? StatusEnum.Blocked : StatusEnum.Active,
        }
      }

      return user;
    });
    this.localStorage.setUsers(updatedUsers);
    this.filteredUsers = this.localStorage.getUsers().filter(user => {
      return this.filteredUsers.find(fUser => fUser.id === user.id);
    });
  }

  translateEnums(value: string): string {
    switch(value) {
      case StatusEnum.Active: return 'Active';
      case StatusEnum.Blocked: return 'Blocked';
      case RoleEnum.User: return 'User';
      case RoleEnum.Admin: return 'Admin';
      default: return '';
    }
  }
}
