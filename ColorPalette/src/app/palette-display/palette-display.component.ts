import { Component, EventEmitter, Input, Output } from '@angular/core';
import { PaletteService } from '../palette.service';
import { ColorResponse } from '../interfaces';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-palette-display',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './palette-display.component.html',
  styleUrl: './palette-display.component.css'
})
export class PaletteDisplayComponent {
	@Input() palette!:ColorResponse;
	@Output() colorChangeRequest = new EventEmitter<string>(); 
	constructor(private colorService: PaletteService) { }

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
