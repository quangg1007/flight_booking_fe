import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { APIUrl } from 'src/environments/enviroment';

@Injectable({
  providedIn: 'root'
})
export class MessageService {

  constructor(private http: HttpClient) {}

  getMessagesByRoomID(room_id: string) : Observable<any> {
    return this.http.get<any>(`${APIUrl}/mongo/message/room/${room_id}`)
  }
}
