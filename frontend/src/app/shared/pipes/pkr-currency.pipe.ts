import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'pkrCurrency',
  standalone: true
})
export class PkrCurrencyPipe implements PipeTransform {
  transform(value: number | string | null | undefined): string {
    if (value === null || value === undefined || value === '') return 'PKR 0';
    const num = typeof value === 'string' ? parseFloat(value) : value;
    if (isNaN(num)) return 'PKR 0';
    return `PKR ${Math.round(num).toLocaleString('en-PK')}`;
  }
}
