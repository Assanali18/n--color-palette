import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { log } from 'console';
declare const colorjs: any; 

@Component({
  selector: 'app-image-palette',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './image-palette.component.html',
  styleUrl: './image-palette.component.css'
})
export class ImagePaletteComponent {
  @Output() colorChangeRequest = new EventEmitter<string>(); 
  
  imageColors: string[] = []; 
  isImageExtract: boolean = false;

  extractColorsFromImage(event: Event): void {    
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      const reader = new FileReader();
      console.log(this.imageColors);
      reader.readAsDataURL(file);
      reader.onload = () => {
        const img = new Image();
        img.src = reader.result as string;
        img.onload = () => {
          colorjs.prominent(img, { amount: 6, format: 'hex' }).then((colors: string[]) => {
            this.imageColors = colors;
            this.isImageExtract = true;
            console.log(this.imageColors);
            
          });
        };
      };
    }
  }

  copyToClipboard(text: string): void {
		navigator.clipboard.writeText(text).then(() => {
		  console.log('Текст скопирован в буфер обмена');
		}).catch(err => {
		  console.error('Ошибка при копировании в буфер обмена: ', err);
		});
	  }
	  requestColorChange(newColor: string): void {
		  this.colorChangeRequest.emit(newColor); 
	  }
}
