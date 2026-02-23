// Importaciones principales de Angular
import { Component, signal, inject } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { computed } from '@angular/core';

// Servicio que gestiona las citas (añadir, actualizar, eliminar)
import { CitasService } from '../../core/services/citas.service';

// Modelo de datos de una cita
import { Cita } from '../../core/models/cita.model';

// Pipe para formatear fechas
import { DatePipe } from '@angular/common';

// Tipos para validadores personalizados
import { AbstractControl, ValidationErrors } from '@angular/forms';

// Pipe personalizada para mostrar el estado de la cita
import { StatusLabelPipe } from '../../shared/pipes/status-label.pipe';

// Componentes reutilizables
import { CitaFormComponent } from '../../shared/components/cita-form/cita-form.component';
import { ConfirmDialogComponent } from '../../shared/components/confirm-dialog.component';

/**
 * Validador personalizado a nivel de formulario.
 * Comprueba que la fecha y hora seleccionadas no sean anteriores al momento actual.
 */
function dateTimeValidator(group: AbstractControl): ValidationErrors | null {

  const date = group.get('date')?.value;
  const time = group.get('time')?.value;

  if (!date || !time) return null; // Si no hay fecha u hora aún, no valida

  const selectedDateTime = new Date(`${date}T${time}`);
  const now = new Date();

  // Si es futura o actual → válido
  // Si es pasada → error
  return selectedDateTime >= now ? null : { pastDateTime: true };
}


@Component({
  selector: 'app-citas-page',
  standalone: true,
  imports: [ReactiveFormsModule, DatePipe, StatusLabelPipe, CitaFormComponent, ConfirmDialogComponent],
  templateUrl: './citas-page.html',
  styleUrl: './citas-page.scss'
})

/*NO DEBE HABER NADA ENTRE @COMPONENT Y LA CLASE CITASPAGE*/

export class CitasPage {

  // Inyección de dependencias moderna con inject()
  private fb = inject(FormBuilder);
  readonly citasService = inject(CitasService);

  /**
   * FORMULARIO DE CREACIÓN DE CITA
   * Utiliza Reactive Forms con validaciones.
   */
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
  },
    { validators: dateTimeValidator }
  );

  /**
   * FORMULARIO DE EDICIÓN
   * Similar al anterior pero incluye id y status.
   */
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
  },
    { validators: dateTimeValidator }
  );

  /**
   * SIGNALS (Angular moderno)
   */
  // Guarda la cita en edición
  editingCita = signal<any | null>(null);
  // Controla si el modal de edición está abierto
  isEditModalOpen = signal(false);
  // Guarda el id de la cita a eliminar
  deleteId = signal<string | null>(null);
  // Controla el filtro (Hoy / Todas)
  filterMode = signal<'today' | 'all'>('today');
  // Texto de búsqueda
  searchTerm = signal('');

  /**
 * MÉTODOS DE EDICIÓN
 */
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

  closeEditModal() {
    this.isEditModalOpen.set(false);
    this.editingCita.set(null);
  }

  openEditModal() {
    this.isEditModalOpen.set(true);
  }

  /**
     * CREAR NUEVA CITA
     */

  onSubmit() {
    if (this.citaForm.invalid) return;

    this.citasService.add(this.citaForm.value as any);

    this.citaForm.reset();
  }

 /**
   * ELIMINACIÓN DE CITA
   */

  openDeleteDialog(id: string) {
    this.deleteId.set(id);
  }

  confirmDelete() {
    if (this.deleteId()) {
      this.citasService.remove(this.deleteId()!);
    }
    this.deleteId.set(null);
  }

  closeDeleteDialog() {
    this.deleteId.set(null);
  }

  /**
   * FILTRADO DE CITAS (computed)
   */
  filteredCitas = computed(() => {
    const all = this.citasService.citas();
    const mode = this.filterMode();
    const term = this.searchTerm().toLowerCase().trim();

    let result = all;

    // Filtro por fecha (Hoy)
    if (mode === 'today') {
      const today = new Date().toISOString().split('T')[0];
      result = result.filter(cita => cita.date === today);
    }

    // Filtro por búsqueda
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

  /**
   * Devuelve la fecha de hoy formateada
   */
  todayLabel = computed(() => {
    const today = new Date();

    return today.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  });

   /**
   * Devuelve el título dinámico de la tabla
   */
  tableTitle = computed(() => {
    return this.filterMode() === 'today'
      ? 'Citas de Hoy'
      : 'Todas las citas';
  });

}