import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

const ACTIVITY_API = 'http://localhost:8080/api/activity/';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root',
})
export class ActivityService {
  constructor(private http: HttpClient) {}

  createActivity(username: string): Observable<any> {
    return this.http.post(
       ACTIVITY_API + 'signin',
      {
        username,
      },
      httpOptions
    );
  }

}
