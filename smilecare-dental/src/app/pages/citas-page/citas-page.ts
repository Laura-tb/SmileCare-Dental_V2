import { Component, signal, inject } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';

import { CitasService } from '../../core/services/citas.service';
import { computed } from '@angular/core';

import { Cita } from '../../core/models/cita.model';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-citas-page',
  standalone: true,
  imports: [ReactiveFormsModule, DatePipe],
  templateUrl: './citas-page.html',
  styleUrl: './citas-page.scss'
})
export class CitasPage {

  private fb = inject(FormBuilder);
  readonly citasService = inject(CitasService);

  citaForm = this.fb.nonNullable.group({
    date: [
      '',
      [
        Validators.required
      ]
    ],

    time: [
      '',
      [
        Validators.required
      ]
    ],

    firstName: [
      '',
      [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(50),
        Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/)
      ]
    ],

    lastName: [
      '',
      [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(80),
        Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/)
      ]
    ],

    dni: [
      '',
      [
        Validators.required,
        Validators.pattern(/^[0-9]{8}[A-Za-z]$/)
      ]
    ],

    phone: [
      '',
      [
        Validators.required,
        Validators.pattern(/^[0-9]{9}$/)
      ]
    ],

    email: [
      '',
      [
        Validators.required,
        Validators.email,
        Validators.maxLength(100)
      ]
    ],

    birthDate: [
      '',
      [
        Validators.required
      ]
    ],

    notes: [
      '',
      [
        Validators.maxLength(300)
      ]
    ]
  });

  editForm = this.fb.nonNullable.group({
    id: [''],

    date: [
      '',
      [
        Validators.required
      ]
    ],

    time: [
      '',
      [
        Validators.required
      ]
    ],

    firstName: [
      '',
      [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(50),
        Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/)
      ]
    ],

    lastName: [
      '',
      [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(80),
        Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/)
      ]
    ],

    dni: [
      '',
      [
        Validators.required,
        Validators.pattern(/^[0-9]{8}[A-Za-z]$/)
      ]
    ],

    phone: [
      '',
      [
        Validators.required,
        Validators.pattern(/^[0-9]{9}$/)
      ]
    ],

    email: [
      '',
      [
        Validators.required,
        Validators.email,
        Validators.maxLength(100)
      ]
    ],

    birthDate: [
      '',
      [
        Validators.required
      ]
    ],

    notes: [
      '',
      [
        Validators.maxLength(300)
      ]
    ],

    status: [
      'pending' as const,
      [
        Validators.required
      ]
    ]
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

  getErrorMessage(
    controlName: keyof typeof this.citaForm.controls,
    form: 'create' | 'edit' = 'create'
  ): string | null {

    const formGroup = form === 'create' ? this.citaForm : this.editForm;
    const control = formGroup.controls[controlName];

    if (!control.touched || !control.errors) return null;

    const errors = control.errors;

    if (errors['required']) return 'Este campo es obligatorio.';
    if (errors['email']) return 'Email no válido.';
    if (errors['minlength']) return `Debe tener al menos ${errors['minlength'].requiredLength} caracteres.`;
    if (errors['maxlength']) return `Máximo ${errors['maxlength'].requiredLength} caracteres.`;
    if (errors['pattern']) return 'Formato incorrecto.';

    return 'Campo inválido.';
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