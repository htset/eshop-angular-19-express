import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { LogMessage } from '../../../../shared/logMessage';

@Injectable({
  providedIn: 'root',
})
export class LoggingService {
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  };

  constructor(private http: HttpClient) {}

  log(logMessage: LogMessage) {
    this.http
      .post<LogMessage>(`${environment.apiUrl}/remoteLogging`, logMessage)
      .subscribe();
  }
}
