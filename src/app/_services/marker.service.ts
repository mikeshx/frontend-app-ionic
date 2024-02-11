import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

const PUBLIC_API = 'http://localhost:8080/api/test/';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root',
})
export class MarkerService {
  constructor(private http: HttpClient) {}

  getMarker(): Observable<any> {
    return this.http.get(PUBLIC_API + 'addmarker', { responseType: 'text' });
  }

}
