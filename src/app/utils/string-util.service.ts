import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StringUtilService {

  constructor() { }

  isEmpty(str: string): boolean {
    return str ? str.length === 0 : false;
  }
}
