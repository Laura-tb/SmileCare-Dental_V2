import { Injectable, signal } from '@angular/core';
import { Cita } from '../models/cita.model';
import { CookiesStorageService } from './cookies-storage.service';

const STORAGE_KEY = 'smilecare_citas_v1';

@Injectable({ providedIn: 'root' })
export class CitasService {
  private readonly _citas = signal<Cita[]>([]);
  readonly citas = this._citas.asReadonly();

  constructor(private storage: CookiesStorageService) {
    const saved = this.storage.get<Cita[]>(STORAGE_KEY) ?? [];
    this._citas.set(saved);
  }

  add(cita: Omit<Cita, 'id' | 'status'>): void {
    const newCita: Cita = {
      ...cita,
      id: crypto.randomUUID ? crypto.randomUUID() : String(Date.now()),
      status: 'pending',
    };

    const updated = [newCita, ...this._citas()];
    this._citas.set(updated);
    this.persist();
  }

  update(updatedCita: Cita): void {
    const updated = this._citas().map(c => (c.id === updatedCita.id ? updatedCita : c));
    this._citas.set(updated);
    this.persist();
  }

  remove(id: string): void {
    const updated = this._citas().filter(c => c.id !== id);
    this._citas.set(updated);
    this.persist();
  }

  private persist(): void {
    this.storage.set(STORAGE_KEY, this._citas());
  }
}