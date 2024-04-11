import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, forkJoin, map } from 'rxjs';
import { ApiResponse, ColorResponse, SimplifiedColor } from './interfaces';


@Injectable({
	providedIn: 'root'
})

export class PaletteService {
	BASE_URL: string = 'https://www.thecolorapi.com/scheme';
	palettes: ColorResponse[] = [];
	types: string[] = ['monochrome', 'monochrome-dark', 'monochrome-light',
		'analogic', 'complement', 'analogic-complement', 'triad', 'quad'];

	constructor(
		private http: HttpClient
	) { }

	
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

	downloadPalettePNG(colors: SimplifiedColor[], name: string) {
		const canvas = document.createElement("canvas");
		canvas.width = colors.length * 200;
		canvas.height = 1000;
		const ctx: any = canvas.getContext("2d");
		colors.forEach((color, index) => {
			ctx.fillStyle = color.hex;
			ctx.fillRect(index * 200, 0, 200, 1000)
		});
		const link = document.createElement("a");
		link.download = name + ".png";
		link.href = canvas.toDataURL();
		link.click();
	}

	downloadPaletteSVG(colors: SimplifiedColor[], name: string) {
		const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
		svg.setAttribute("xmlns", "http://www.w3.org/2000/svg");
		svg.setAttribute("width", "100%");
		svg.setAttribute("height", "100%");
		svg.setAttribute("viewbox", "0 0 100 100");
		svg.setAttribute("preserveAspectRatio", "none");
		colors.forEach((color: any, index: number) => {
			const rect: any = document.createElementNS("http://www.w3.org/2000/svg", "rect");
			const width: number = 100 / colors.length;
			rect.setAttribute("x", index * width);
			rect.setAttribute("y", 0);
			rect.setAttribute("width", width);
			rect.setAttribute("height", 100);
			rect.setAttribute("fill", color.hex);
			svg.appendChild(rect);
		});
		const svgData = new XMLSerializer().serializeToString(svg);
		const svgBlob = new Blob([svgData], { type: "image/svg+xml;charset=utf-8" });
		const svgUrl = URL.createObjectURL(svgBlob);
		const downloadLink = document.createElement("a");
		downloadLink.download = name + ".svg"
		downloadLink.href = svgUrl;
		downloadLink.click()
	}

	downloadPaletteCSS(colors: SimplifiedColor[], name: string) {
		const css = `:root{
			${colors.map((color, index) => `--color-${index + 1}: ${color.hex};`)
				.join("\n")}
		}`;
		const blob = new Blob([css], { type: "text/css" });
		const url = URL.createObjectURL(blob);
		const link = document.createElement("a");
		link.download = name + ".css";
		link.href = url;
		link.click()
	}

	downloadPaletteJSON(colors: SimplifiedColor[], name: string) {
		const json = JSON.stringify(colors);
		const blob = new Blob([json], {
			type: "application/json",
		});
		const url = URL.createObjectURL(blob);
		const link = document.createElement("a");
		link.download = name + ".json";
		link.href = url;
		link.click()
	}
}

