import type { OrderRequestDTO, Order } from "./types";

export async function getOrdersByHelper(helperId: string) {
	const response = await fetch(
		`https://nicetry.franciswibisono.com/order/orders/helper-id?helperId=${helperId}`
	);
	if (!response.ok) {
		throw new Error('Failed to fetch orders');
	}
	return await response.json();
}
export const createOrder = async (serviceId: string, token: string): Promise<Order> => {
	const response = await fetch('https://nicetry.franciswibisono.com/order/orders/create', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${token}`
		},
		body: JSON.stringify({ serviceId })
	});

	if (!response.ok) {
		throw new Error(`HTTP error! status: ${response.status}`);
	}

	const data = await response.json();
	return data;
};
