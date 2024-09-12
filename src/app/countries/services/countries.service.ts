import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, combineLatest, map, of, tap } from 'rxjs';
import {
  Country,
  Region,
  SmallCountry,
} from '../interfaces/country.interfaces';

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
    return this.http.get<Country[]>(url).pipe(
      map((countries) =>
        countries.map((country) => ({
          name: country.name.common,
          cca3: country.cca3,
          borders: country.borders ?? [], //es un operador de covalencia nula ??
        }))
      )
    );
  }

  getCountryByAlphaCode(alphaCode: string): Observable<SmallCountry> {
    const url: string = `${this.baseUrl}/alpha/${alphaCode}?fields=cca3,name,borders`;
    return this.http.get<Country>(url).pipe(
      map((country) => ({
        name: country.name.common,
        cca3: country.cca3,
        borders: country.borders ?? [],
      }))
    );
  }

  getCountryBordersByCodes(borders: string[]): Observable<SmallCountry[]> {
    if (!borders || borders.length === 0) return of([]);

    const countriesRequest: Observable<SmallCountry>[] = [];
    borders.forEach((code) => {
      const request = this.getCountryByAlphaCode(code);
      countriesRequest.push(request);
    });

    // el combineLatest va a emitir hasta que todos los observables emitan un valor
    return combineLatest(countriesRequest);
  }
}
