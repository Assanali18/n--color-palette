import { Component, OnInit, ViewChild } from '@angular/core';
import { PaletteService } from '../palette.service';
import { CommonModule } from '@angular/common';
import { ColorResponse } from '../interfaces';
import { FormsModule } from '@angular/forms';
import { PaletteDisplayComponent } from "../palette-display/palette-display.component";
import chroma from 'chroma-js';
import { ImagePaletteComponent } from "../image-palette/image-palette.component";
import { RouterLink } from '@angular/router';


@Component({
    selector: 'app-main-page',
    standalone: true,
    templateUrl: './main-page.component.html',
    styleUrls: ['./main-page.component.css'],
    imports: [
        CommonModule,
        FormsModule,
        PaletteDisplayComponent,
        ImagePaletteComponent,
        RouterLink,
    ]
})
export class MainPageComponent implements OnInit {

  currentColor: string = '';
  currentCount: number = 6;
  palettes: ColorResponse[] = []; 
  isImageExtract: boolean = false;
  imageColors: string[] = [];

  @ViewChild('childComponent') image_palette!: ImagePaletteComponent;

  constructor(private colorService: PaletteService) { }

  ngOnInit() {
    this.colorService.fetchAllColors('a589eb', 6)
        .subscribe(data => { 
          this.palettes = data; 
        });
  }

  handleKeyUp(value: string): void {
    if (this.isValidColor(value)) {
      this.currentColor = value;
      this.colorService.fetchAllColors(this.colorToHex(this.currentColor), this.currentCount)
        .subscribe(data => { 
          this.palettes = data; 
          console.log(this.palettes);
        });
    }
  }

  handleChange(value: number): void {
    this.currentCount = value;
    this.colorService.fetchAllColors(this.colorToHex(this.currentColor), this.currentCount)
      .subscribe(data => { 
        this.palettes = data;
      });
  }

  isValidColor(value: string): boolean {
    return /^#?[0-9A-F]{6}$/i.test(value) || /^(?:[0-9a-fA-F]{3}){1,2}$/.test(value);
  }

  colorToHex(color: string): string {
    return chroma(color).hex().slice(1);
  }

  handleColorChange(newColor: string): void {
    this.currentColor = newColor; 
    this.handleKeyUp(newColor); 
  }

  onFileChange(event:Event){
    this.image_palette.extractColorsFromImage(event);
  }
  
}
