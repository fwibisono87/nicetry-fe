export interface Game {
	id: string;
	name: string;
	image: string;
	url: string;
	createdAt: string;
	updatedAt: string;
}

export interface User {
	id: string;
	email: string;
	password?: string; // I marked this optional as it might not always be present
	firstName: string;
	lastName: string;
	imageUrl: string | null;
	createdAt: string;
	updatedAt: string;
	role: string;
}

export interface Service {
	id: string;
	name: string;
	description: string;
	game: Game;
	helper: User;
	price: number;
	createdAt: string;
	updatedAt: string;
}
export interface Game {
	id: string;
	name: string;
	image: string;
	url: string;
	createdAt: string;
	updatedAt: string;
}

export interface ServiceRequestDTO {
	name: string;
	description: string;
	price: number;
	gameId: string;
}


interface AdditionalProperties {
	service: Service;
	customer: User;
}
export interface Order {
	id: string;
	customerId: string;
	helperId: string;
	serviceId: string;
	status: string;
	updatedAt: string;
	createdAt: string;
	additionalProperties: AdditionalProperties;
}

export interface OrderRequestDTO {
	serviceId: string;
	gameId: string;
	quantity: number;
	note: string;
}
