import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { filter, switchMap, tap } from 'rxjs';
import { CountriesService } from '../../services/countries.service';
import { Region, SmallCountry } from '../../interfaces/country.interfaces';

@Component({
  selector: 'app-selector-page',
  templateUrl: './selector-page.component.html',
  styles: ``,
})
export class SelectorPageComponent implements OnInit {
  public countriesByRegion: SmallCountry[] = [];
  public borders: SmallCountry[] = [];

  // se define el formulario
  public myForm: FormGroup = this.fb.group({
    region: ['', Validators.required],
    country: ['', Validators.required],
    border: ['', Validators.required],
  });

  constructor(
    private fb: FormBuilder,
    private countriesService: CountriesService
  ) {}
  ngOnInit(): void {
    // el ngOnInit debe ser sencillo por tanto llamamos a las funciones externas
    this.onRegionChange();
    this.onCountryChange();
  }

  // se obtienen las regiones del servicio
  get regions(): Region[] {
    return this.countriesService.regions;
  }

  onRegionChange(): void {
    // creamos un observable para detectar los cambios en un objeto
    this.myForm
      .get('region')!
      .valueChanges.pipe(
        // cuando cambia el valor de la region, se limpia el input del pais
        tap(() => this.myForm.get('country')!.setValue('')),
        // se invoca la funcion para hacer la nueva peticion
        switchMap((region) =>
          this.countriesService.getCountriesByRegion(region)
        )
      )
      .subscribe((countries) => {
        this.countriesByRegion = countries;
      });
  }

  onCountryChange(): void {
    // creamos un observable para detectar los cambios en un objeto
    this.myForm
      .get('country')!
      .valueChanges.pipe(
        // cuando cambia el valor del pais, se limpia el input de las fronteras
        tap(() => this.myForm.get('border')!.setValue('')),
        tap(() => (this.borders = [])),
        // se aplica un filtro para cuando el value devuelva un nulo, es otra manera de
        // usar el if al principio
        filter((value: string) => value.length > 0),
        // se invoca la funcion para hacer la nueva peticion
        switchMap((alphaCode) =>
          this.countriesService.getCountryByAlphaCode(alphaCode)
        ),
        switchMap((country) =>
          this.countriesService.getCountryBordersByCodes(country.borders)
        )
      )
      .subscribe((countries) => {
        this.borders = countries;
      });
  }
}
