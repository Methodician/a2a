import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'truncateTitle'
})
export class TruncateTitlePipe implements PipeTransform {

  transform(value: string, args?: any): string {
    let max = args ? args : 30;

    if (value.length > max) {
      value = value.substr(0, max);
      value += '...';
    }
    return value;
  }

}
