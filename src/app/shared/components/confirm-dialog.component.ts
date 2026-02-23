import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="modal">
      <div class="modal__overlay" (click)="cancel()"></div>

      <div class="modal__content">
        <h3>{{ title }}</h3>
        <p>{{ message }}</p>

        <div class="modal__actions">
          <button type="button" (click)="cancel()">Cancelar</button>
          <button type="button" class="btn-danger" (click)="confirm()">
            Confirmar
          </button>
        </div>
      </div>
    </div>
  `
})
export class ConfirmDialogComponent {

  @Input() title = 'Confirmar acción';
  @Input() message = '¿Estás seguro?';

  @Output() confirmed = new EventEmitter<void>();
  @Output() closed = new EventEmitter<void>();

  confirm() {
    this.confirmed.emit();
  }

  cancel() {
    this.closed.emit();
  }
}