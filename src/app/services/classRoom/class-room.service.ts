import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ClassRoom } from '../../_models/class-room';

@Injectable({
  providedIn: 'root'
})
export class ClassRoomService {
  private url: string = `${environment.apiUrl}`;

  constructor(private httpClient: HttpClient) { }

  getAllClassRoom(): Observable<ClassRoom[]>{
    return this.httpClient.get<ClassRoom[]>(`${this.url}/api/ClassRoom`);
  }
}
