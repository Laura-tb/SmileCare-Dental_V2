import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'statusLabel',
  standalone: true
})
export class StatusLabelPipe implements PipeTransform {

  transform(value: string): string {

    switch (value) {
      case 'pending':
        return 'Pendiente';

      case 'completed':
        return 'Completada';

      case 'cancelled':
        return 'Cancelada';

      default:
        return value;
    }
  }
}