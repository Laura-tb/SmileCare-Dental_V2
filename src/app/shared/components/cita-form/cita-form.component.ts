import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';


@Component({
    selector: 'app-cita-form',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule],
    templateUrl: './cita-form.component.html',
})
export class CitaFormComponent {

    @Input() formGroup!: FormGroup;
    @Input() submitLabel = 'Guardar';

    @Output() formSubmit = new EventEmitter<void>();

    onSubmit() {
        this.formSubmit.emit();
    }

    getErrorMessage(controlName: string): string | null {

        const control = this.formGroup.get(controlName);

        if (!control || !control.touched || !control.errors) return null;

        const errors = control.errors;

        if (errors['required']) return 'Este campo es obligatorio.';
        if (errors['email']) return 'Email no válido.';
        if (errors['minlength']) return `Debe tener al menos ${errors['minlength'].requiredLength} caracteres.`;
        if (errors['maxlength']) return `Máximo ${errors['maxlength'].requiredLength} caracteres.`;
        if (errors['pattern']) return 'Formato incorrecto.';

        if (this.formGroup.errors?.['pastDateTime']) {
            return 'No puedes seleccionar una fecha y hora pasada.';
        }

        return null;
    }

}

