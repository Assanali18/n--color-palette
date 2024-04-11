import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

declare const colorjs: any;

@Component({
	selector: 'app-image-palette',
	standalone: true,
	imports: [
		CommonModule,
	],
	templateUrl: './image-palette.component.html',
	styleUrl: './image-palette.component.css'
})
export class ImagePaletteComponent {
	@Input() parentType: any;
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
					});
				};
			};
		}
	}

	copyToClipboard(text: string): void {
		navigator.clipboard.writeText(text);
	}
	requestColorChange(newColor: string): void {
		this.colorChangeRequest.emit(newColor);
	}
}
