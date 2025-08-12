import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { combineLatest, Observable, of } from 'rxjs';
import { Country } from '../interfaces/country.interface';

@Injectable({ providedIn: 'root' })
export class CountryService {
  private baseUrl = 'https://restcountries.com/v3.1';
  private http = inject(HttpClient);

  private _regions = ['Africa', 'Americas', 'Asia', 'Europe', 'Oceania'];

  get regions(): string[] {
    return [...this._regions];
  }

  getCountriesByRegion(region: string): Observable<Country[]> {
    if (!region) return of([]);

    const url = `${this.baseUrl}/region/${region}?fields=cca3,name,borders`;

    return this.http.get<Country[]>(url);
  }

  getCountryByAlphaCode(alphaCode: string): Observable<Country> {
    const url = `${
      this.baseUrl
    }/alpha/${alphaCode.toLowerCase()}?fields=cca3,name,borders`;
    return this.http.get<Country>(url);
  }

  // Esto se utiliza cuando la API no tiene otra forma mas eficiente
  // getCountryNamesByCodeArray(countryCodes: string[]): Observable<Country[]> {
  //   if (!countryCodes || countryCodes.length === 0) return of([]);

  //   const countriesRequests: Observable<Country>[] = [];
  //   countryCodes.forEach((code) => {
  //     const request = this.getCountryByAlphaCode(code);
  //     countriesRequests.push(request);
  //   });

  //   return combineLatest(countriesRequests);
  // }
  getCountryNamesByCodeArray(countryCodes: string[]): Observable<Country[]> {
    if (!countryCodes || countryCodes.length === 0) return of([]);

    const joinedCodes = countryCodes.join(',');
    const url = `${this.baseUrl}/alpha?fields=cca3,name,borders&codes=${joinedCodes}`;

    return this.http.get<Country[]>(url);
  }
}
