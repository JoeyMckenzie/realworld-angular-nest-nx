import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Message } from '@realworld-angular-nest-nx/api-interfaces';

@Component({
  selector: 'realworld-angular-nest-nx-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  hello$ = this.http.get<Message>('/api/hello');
  constructor(private http: HttpClient) {}
}
