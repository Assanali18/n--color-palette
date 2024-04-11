import { Component, EventEmitter, Input, Output, QueryList, ViewChildren } from '@angular/core';
import { PaletteService } from '../palette.service';
import { SimplifiedColor } from '../interfaces';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ColorPickerDirective, ColorPickerModule } from 'ngx-color-picker';

@Component({
	selector: 'app-palette-display',
	standalone: true,
	imports: [
		CommonModule,
		FormsModule, 
		ColorPickerModule
	],
	templateUrl: './palette-display.component.html',
	styleUrl: './palette-display.component.css'
})

export class PaletteDisplayComponent {
	@Input() palette!: any;
	@Input() parentType: any;
	@Input() type!: string;
	@Output() colorChangeRequest = new EventEmitter<string>();
	@ViewChildren('colorPickerInput') colorPickerInputs!: QueryList<ColorPickerDirective>;
	color: string = '';

	constructor(private colorService: PaletteService) { }

	get colors() {
		return this.parentType === 'mainPage' ? this.palette.colors : this.palette;
	}
	get mode() {
		return this.parentType === 'mainPage' ? this.palette.mode : this.type;
	}

	openColorPicker(index: number): void {
		const colorPickerInput = this.colorPickerInputs.toArray()[index];
		colorPickerInput.cpToggleChange.emit(true);
	}
	copyToClipboard(text: string): void {
		navigator.clipboard.writeText(text);
	}
	requestColorChange(newColor: string): void {
		this.colorChangeRequest.emit(newColor);
	}

	toggleActive(event: MouseEvent): void {
		const clickedElement = event.currentTarget as HTMLElement;
		if (clickedElement.classList.contains('dots')) {
			clickedElement.classList.toggle('active');
		}
	}

	downloadPalettePNG(colors: SimplifiedColor[], name: string) {
		this.colorService.downloadPalettePNG(colors, name);
	}

	downloadPaletteSVG(colors: SimplifiedColor[], name: string) {
		this.colorService.downloadPaletteSVG(colors, name);
	}

	downloadPaletteCSS(colors: SimplifiedColor[], name: string) {
		this.colorService.downloadPaletteCSS(colors, name);
	}

	downloadPaletteJSON(colors: SimplifiedColor[], name: string) {
		this.colorService.downloadPaletteJSON(colors, name);
	}
}
