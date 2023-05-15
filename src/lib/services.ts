import type { Service, Game, ServiceRequestDTO, Order } from './types';

export async function getServicesByHelper(id: string) {
	const url = `https://nicetry.franciswibisono.com/helper/services/by-helper?id=${id}`;
	let response = await fetch(url, {
		method: 'GET',
		mode: 'cors'
	});
	return await response.json();
}

export async function getServiceById(id: string) {
	const url = `https://nicetry.franciswibisono.com/helper/services/id?id=${id}`;
	let response = await fetch(url, {
		method: 'GET',
		mode: 'cors'
	});
	return await response.json();
}

export async function updateServiceById(id: string, token: string, data: Partial<Service>) {
	const url = `https://nicetry.franciswibisono.com/helper/services/update?id=${id}`;
	let response = await fetch(url, {
		method: 'PUT',
		mode: 'cors',
		headers: {
			Authorization: 'Bearer ' + token,
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(data)
    });
    if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status} - ${response.text}`);
		}
	return await response.json();
}
export const createService = async (
	service: ServiceRequestDTO,
	userToken: string
): Promise<Service> => {
	const response = await fetch('https://nicetry.franciswibisono.com/helper/services/create', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${userToken}`
		},
		body: JSON.stringify(service)
	});

	if (!response.ok) {
		throw new Error(`HTTP error! status: ${response.status}`);
	}

	return await response.json();
};

export const getAllGames = async (): Promise<Game[]> => {
	const response = await fetch('https://nicetry.franciswibisono.com/helper/games');

	if (!response.ok) {
		throw new Error(`HTTP error! status: ${response.status}`);
	}

	return await response.json();
};

export const getOrderById = async (id: string, token: string): Promise<Order> => {
	const response = await fetch(`https://nicetry.franciswibisono.com/order/orders/id?id=${id}`, {
		headers: {
			Authorization: `Bearer ${token}`
		}
	});
	const data = await response.json();
	return data;
};


export const updateOrderStatusById = async (
	id: string,
	token: string,
	newStatus: string
): Promise<Order> => {
	const response = await fetch(
		`https://nicetry.franciswibisono.com/order/orders/update-status?orderId=${id}&newStatus=${newStatus}`,
		{
			method: 'PUT',
			headers: {
				Authorization: `Bearer ${token}`,
				'Content-Type': 'application/json'
			}
		}
	);
	const data = await response.json();
	return data;
};

export const getAllServices = async (): Promise<Service[]> => {
	const response = await fetch(`https://nicetry.franciswibisono.com/helper/services`);
	const data = await response.json();
	return data;
};

export const getServicesByGame = async (id: string): Promise<Service[]> => {
	const response = await fetch(
		`https://nicetry.franciswibisono.com/helper/services/by-game?id=${id}`
	);
	const data = await response.json();
	return data;
};
