import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { School } from '../../_models/school';

@Injectable({
  providedIn: 'root'
})
export class SchoolService {
  private url: string = `${environment.apiUrl}`;

  constructor(private httpClient: HttpClient) { }

  getAllSchools(): Observable<School[]>{
    return this.httpClient.get<School[]>(`${this.url}/api/School`);
  }
}
