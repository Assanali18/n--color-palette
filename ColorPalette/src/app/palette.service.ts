import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, forkJoin, map } from 'rxjs';
import { ApiResponse, ColorResponse } from './interfaces';


@Injectable({
  providedIn: 'root'
})
export class PaletteService {
  BASE_URL:string = 'https://www.thecolorapi.com/scheme'
  constructor(
    private http: HttpClient
  ) { }
  palettes: ColorResponse[] = [];
  types:string[] = ['monochrome', 'monochrome-dark', 'monochrome-light', 
                    'analogic', 'complement', 'analogic-complement', 'triad' ]
              
  
  fetchColors(hex: string, mode: string, count: number): Observable<ColorResponse> {
    const url = `https://www.thecolorapi.com/scheme?hex=${hex}&mode=${mode}&count=${count}&format=json`;
    return this.http.get<ApiResponse>(url).pipe(
      map(apiResponse => ({
        mode: apiResponse.mode,
        count: parseInt(apiResponse.count, 10),
        colors: apiResponse.colors.map(color => ({
          hex: color.hex.value,
          name: color.name.value
        }))
      }))
    );
  }

  fetchAllColors(hex: string, count: number): Observable<ColorResponse[]> {

    const requests = this.types.map(type => this.fetchColors(hex, type, count));
    return forkJoin(requests); 
  }
}

