import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filtros'
})
export class FiltrosPipe implements PipeTransform {

  transform(value: any[], criterio: string): any[] {
    if (!criterio || !value) {
      return value;
    }

    const regex = new RegExp(criterio, 'i'); // Usa la variable `criterio`
    return value.filter(item => regex.test(item.nombre)); // Filtra por `nombre`
  }

}
