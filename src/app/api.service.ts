import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs';
export interface User {
  id: number,
  email: string,
  name: {
    first: string;
    last: string
  }
  picture: {
    thumbnail: string
  }
  location: {
    city: string
  }
  gender: string,
}
@Injectable({
  providedIn: 'root'
})

export class ApiService {
  private url = 'https://randomuser.me/api/?results=100'
  constructor(private http: HttpClient) {
   }
    getUsers(): Observable<User[]> {
    return this.http
      .get<{ results: User[] }>(this.url)
      .pipe(
        // import { map } from 'rxjs/operators'
        map((res: { results: User[] }) => res.results)
      );
  }
}
