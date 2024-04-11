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

  currentColor: string = '#a589eb';
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

  handleChangeColor(value: string): void {
      try{
        this.currentColor = value;
      this.colorService.fetchAllColors(this.colorToHex(this.currentColor), this.currentCount)
        .subscribe(data => { 
          this.palettes = data; 
        });
      }catch{}
  }

  handleChangeCount(value: number): void {
    this.currentCount = value;
    this.colorService.fetchAllColors(this.colorToHex(this.currentColor), this.currentCount)
      .subscribe(data => { 
        this.palettes = data;
      });
  }

  colorToHex(color: string): string {    
    return chroma(color).hex().slice(1);
  }

  onFileChange(event:Event){
    this.image_palette.extractColorsFromImage(event);
  }
  
}
