import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LocalDataService {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public saveData(key: string, value: any): void {
    localStorage.setItem(key, JSON.stringify(value));
  }

  public getData<T>(key: string): T | null {
    const item = localStorage.getItem(key);
    try {
      return item == null || item === '' ? null : (JSON.parse(item) as T);
    } catch {
      console.error(`Data not valid at key ${key}`, item);
      return null;
    }
  }

  public removeData(key: string): void {
    localStorage.removeItem(key);
  }

  public clearData() {
    localStorage.clear();
  }
}
