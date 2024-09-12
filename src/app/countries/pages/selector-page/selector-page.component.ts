import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CountriesService } from '../../services/countries.service';
import { Region } from '../../interfaces/country.interfaces';
import { switchMap } from 'rxjs';

@Component({
  selector: 'app-selector-page',
  templateUrl: './selector-page.component.html',
  styles: ``,
})
export class SelectorPageComponent implements OnInit {
  // se define el formulario
  public myForm: FormGroup = this.fb.group({
    region: ['', Validators.required],
    country: ['', Validators.required],
    borders: ['', Validators.required],
  });

  constructor(
    private fb: FormBuilder,
    private countriesService: CountriesService
  ) {}
  ngOnInit(): void {
    // el ngOnInit debe ser sencillo por tanto llamamos a las funciones externas
    this.onRegionChange();
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
        switchMap((region) =>
          this.countriesService.getCountriesByRegion(region)
        )
      )
      .subscribe((countries) => {
        console.log({ countries });
      });
  }
}
