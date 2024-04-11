import { Component, ViewChild } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ColorResponse, SimplifiedColor } from '../interfaces';
import { ImagePaletteComponent } from '../image-palette/image-palette.component';
import { PaletteService } from '../palette.service';
import chroma from 'chroma-js';
import { PaletteDisplayComponent } from "../palette-display/palette-display.component";
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ColorPickerModule } from 'ngx-color-picker';
@Component({
    selector: 'app-create-page',
    standalone: true,
    templateUrl: './create-page.component.html',
    styleUrl: './create-page.component.css',
    imports: [
        RouterLink,
        ImagePaletteComponent,
        PaletteDisplayComponent,
        FormsModule,
        CommonModule,
        ColorPickerModule,
    ]
})
export class CreatePageComponent {

  colorPicker:string = '';
  currentColor: string = '#a589eb';
  currentCount: number = 6;
  currentMode: string = 'monochrome';
  palettes: ColorResponse[] = []; 
  isImageExtract: boolean = false;
  imageColors: string[] = [];
  allColors:SimplifiedColor[] = [];

  @ViewChild('childComponent') image_palette!: ImagePaletteComponent;
  color: any;
  paletteName:string = 'palette';
  selectedFormat:string = 'png';
  constructor(private colorService: PaletteService) { }

  ngOnInit() {
    this.colorService.fetchColors(this.colorToHex(this.currentColor), this.currentMode, this.currentCount).subscribe(colorResponse => {
      this.allColors = colorResponse.colors;
    });
  }

  mainFunction(){
    this.colorService.fetchColors(this.colorToHex(this.currentColor), this.currentMode, this.currentCount).subscribe(colorResponse => {
      this.allColors = colorResponse.colors;
    });
  }

  handleChangeColor(value: string): void {
    try{
      this.currentColor = value;
      this.mainFunction();
    }catch{}
  }

  handleChangeCount(value: number): void {
    this.currentCount = value;
    this.mainFunction();
  }

  handleChooseMode(mode: string){
    this.currentMode = mode;
    this.mainFunction();
  }

  colorToHex(color: string): string {
    return chroma(color).hex().slice(1);
  }

  onFileChange(event:Event){
    this.image_palette.extractColorsFromImage(event);
  }

  downloadPalette(selectedFormat:string, paletteName:string) {
    switch(selectedFormat){
      case "png":
          this.downloadPalettePNG(this.allColors, paletteName);
          break;
      case "svg":
          this.downloadPaletteSVG(this.allColors, paletteName);
          break;
      case "css":
          this.downloadPaletteCSS(this.allColors, paletteName);
          break;
      case "json":
          this.downloadPaletteJSON(this.allColors, paletteName);
          break;
      default:
          break;
  }
  }


  downloadPalettePNG(colors:SimplifiedColor[], name:string){
		this.colorService.downloadPalettePNG(colors, name);
	}

	downloadPaletteSVG(colors:SimplifiedColor[], name:string){
		this.colorService.downloadPaletteSVG(colors, name);
	}

	downloadPaletteCSS(colors:SimplifiedColor[], name:string){
		this.colorService.downloadPaletteCSS(colors, name);
	}

	downloadPaletteJSON(colors:SimplifiedColor[], name:string){
		this.colorService.downloadPaletteJSON(colors, name);
	}
}
