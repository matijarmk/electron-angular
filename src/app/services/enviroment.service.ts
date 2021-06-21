import { environment } from './../../environments/environment';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class EnvironmentService {
  get apiBaseUrl() {
    return environment.apiUrl;
  }
  constructor() {}
}
