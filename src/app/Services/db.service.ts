import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';


const baseUrl: string = 'http://localhost:3000';

@Injectable({
  providedIn: 'root'
})

export class DBService {

  constructor(private http: HttpClient) { }

  getAllGroups(): Observable<any> {
    return this.http.get(`${baseUrl}/GroupData`);
  }

  getAllTables(): Observable<any> {
    return this.http.get(`${baseUrl}/TableData`);
  }


  exportTables(tables: any[]): Observable<any> {
    return this.http.post(`${baseUrl}/ExportTables`, tables);
  }




}
