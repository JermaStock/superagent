import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {delay, Observable, of, tap} from "rxjs";
import {users} from "./users";

@Injectable({
  providedIn: 'root',
})
export class DataService {

  constructor(private http: HttpClient) { }

  load() {
    return of(users).pipe(
      // Симулируем время запроса
      delay(1250),
    );
  }
}

