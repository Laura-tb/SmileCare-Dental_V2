import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class CookiesStorageService {
  get<T>(key: string): T | null {
    const value = this.getCookie(key);
    if (!value) return null;

    try {
      return JSON.parse(decodeURIComponent(value)) as T;
    } catch {
      return null;
    }
  }

  set<T>(key: string, value: T, days = 365): void {
    const encoded = encodeURIComponent(JSON.stringify(value));
    const expires = new Date(Date.now() + days * 24 * 60 * 60 * 1000).toUTCString();
    document.cookie = `${key}=${encoded}; expires=${expires}; path=/; SameSite=Lax`;
  }

  remove(key: string): void {
    document.cookie = `${key}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; SameSite=Lax`;
  }

  private getCookie(name: string): string | null {
    const prefix = name + '=';
    const parts = document.cookie.split('; ');
    for (const part of parts) {
      if (part.startsWith(prefix)) return part.substring(prefix.length);
    }
    return null;
  }
}