import { HttpEvent } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CacheEntry } from '../models/caching.model';

const TTL = 3_000;

@Injectable({
  providedIn: 'root',
})
export class CachingService {
  constructor() {}

  readonly #cache = new Map<string, CacheEntry>();

  get(key: string): HttpEvent<unknown> | undefined {
    const cached = this.#cache.get(key);

    if (!cached) {
      return undefined;
    }

    // 👇 Remove the entry if expired
    const hasExpired = new Date().getTime() >= cached.expiresOn;
    if (hasExpired) {
      this.#cache.delete(key);
      return undefined;
    }

    return cached.data;
  }

  set(key: string, data: HttpEvent<unknown>): void {
    // Add TTL for some chaning data
    if (key.includes('autocomplete')) {
      this.#cache.set(key, {
        data,
        // 👇 Set its lifespan
        expiresOn: new Date().getTime() + TTL,
      });
    }
  }
}
