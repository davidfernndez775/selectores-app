import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, tap } from 'rxjs';
import { Region, SmallCountry } from '../interfaces/country.interfaces';

@Injectable({
  providedIn: 'root',
})
export class CountriesService {
  // definimos la url
  private baseUrl: string = 'https://restcountries.com/v3.1';

  // creamos la variable privada por motivos de seguridad
  private _regions: Region[] = [
    Region.Africa,
    Region.Americas,
    Region.Asia,
    Region.Europe,
    Region.Oceania,
  ];

  // para poder ejecutar el HttpClient hay que importar el HttpCommonModule en el
  // app.module.ts
  constructor(private http: HttpClient) {}

  // para obtener los valores de la variable privada usamos un get
  get regions(): Region[] {
    return [...this._regions];
  }

  // peticion para busqueda de pais segun region
  getCountriesByRegion(region: Region): Observable<SmallCountry[]> {
    // si no se devuelve ninguna region, se retorna un observable vacio
    if (!region) return of([]);

    // si hay alguna region
    const url: string = `${this.baseUrl}/region/${region}?fields=cca3,name,borders`;
    return this.http
      .get<SmallCountry[]>(url)
      .pipe(tap((response) => console.log({ response })));
  }
}
