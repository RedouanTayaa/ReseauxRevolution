import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  standalone: true,
  name: 'customDateFormat'
})
export class CustomDateFormatPipe implements PipeTransform {
  transform(dateObject: any): string {
    if (!dateObject || !dateObject.date) {
      return '';
    }

    const date = new Date(dateObject.date);

    const day = this.padZero(date.getDate());
    const month = this.padZero(date.getMonth() + 1);
    const year = date.getFullYear().toString().slice(-2);
    const hours = this.padZero(date.getHours());
    const minutes = this.padZero(date.getMinutes());

    return `${day}/${month}/${year} ${hours}:${minutes}`;
  }

  private padZero(value: number): string {
    return value < 10 ? `0${value}` : value.toString();
  }
}
