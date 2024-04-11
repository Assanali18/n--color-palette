export interface ApiResponse {
	mode: string;
	count: string;
	colors: Array<{
		hex: { value: string };
		name: { value: string };
	}>;
}

export interface SimplifiedColor {
	hex: string;
	name: string;
}

export interface ColorResponse {
	mode: string;
	count: number;
	colors: SimplifiedColor[];
}