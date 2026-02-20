import { Component, signal, inject } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';

import { CitasService } from '../../core/services/citas.service';
import { computed } from '@angular/core';

import { Cita } from '../../core/models/cita.model';

@Component({
  selector: 'app-citas-page',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './citas-page.html',
  styleUrl: './citas-page.scss'
})
export class CitasPage {

  private fb = inject(FormBuilder);
  readonly citasService = inject(CitasService);

  citaForm = this.fb.nonNullable.group({
    date: ['', Validators.required],
    time: ['', Validators.required],
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    dni: ['', Validators.required],
    phone: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    birthDate: ['', Validators.required],
    notes: ['']
  });

  editForm = this.fb.nonNullable.group({
    id: [''],
    date: ['', Validators.required],
    time: ['', Validators.required],
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    dni: ['', Validators.required],
    phone: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    birthDate: ['', Validators.required],
    notes: [''],
    status: ['pending' as const]
  });

  editingCita = signal<any | null>(null);

  startEdit(cita: any) {
    this.editForm.patchValue(cita);
    this.editingCita.set(cita);
    this.isEditModalOpen.set(true);
  }

  saveEdit() {
    if (this.editForm.invalid) return;

    const updated: Cita = this.editForm.getRawValue();

    this.citasService.update(updated);

    this.isEditModalOpen.set(false);
    this.editingCita.set(null);
  }

  isEditModalOpen = signal(false);

  openEditModal() {
    this.isEditModalOpen.set(true);
  }

  closeEditModal() {
    this.isEditModalOpen.set(false);
    this.editingCita.set(null);
  }

  onSubmit() {
    if (this.citaForm.invalid) return;

    this.citasService.add(this.citaForm.value as any);

    this.citaForm.reset();
  }


  filterMode = signal<'today' | 'all'>('today');

  searchTerm = signal('');

  filteredCitas = computed(() => {
    const all = this.citasService.citas();
    const mode = this.filterMode();
    const term = this.searchTerm().toLowerCase().trim();

    let result = all;

    // Filtro Hoy / Todas
    if (mode === 'today') {
      const today = new Date().toISOString().split('T')[0];
      result = result.filter(cita => cita.date === today);
    }

    // Filtro búsqueda
    if (term) {
      result = result.filter(cita =>
        `${cita.firstName} ${cita.lastName}`.toLowerCase().includes(term) ||
        cita.dni.toLowerCase().includes(term) ||
        cita.phone.toLowerCase().includes(term) ||
        cita.email.toLowerCase().includes(term)
      );
    }

    return result;
  });

  todayLabel = computed(() => {
    const today = new Date();

    return today.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  });

  tableTitle = computed(() => {
    return this.filterMode() === 'today'
      ? 'Citas de Hoy'
      : 'Todas las citas';
  });

}