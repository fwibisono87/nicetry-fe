<script lang="ts">
	import { onMount } from 'svelte';
	import { getAllGames, getAllServices, getServicesByGame } from '$lib/services';
	import { createOrder, getOrderByCustomer } from '$lib/orders';
	import type { Game, Service, Order } from '$lib/types';
	import { rupiahFormatter } from '$lib/formatters';
	import { toastEnable, userToken, userData } from '$lib/stores';
	import { get } from 'svelte/store';
	import { goto } from '$app/navigation';
	import EosIconsLoading from '~icons/eos-icons/loading';

	let games: Game[] = [];
	let services: Service[] = [];
	let servicesFiltered = false;
	let isCreatingOrder = false;
	let targetService = '';

	let gamesAreLoading = true;
	let servicesAreLoading = true;
	let ordersAreLoading = true;

	let myOrders: Order[] = [];
	let isLoggedInCustomer = false;

	onMount(async () => {
		try {
			[games, services] = await Promise.all([getAllGames(), getAllServices()]);
			gamesAreLoading = false;
			servicesAreLoading = false;

			if (get(userData)?.role == 'user' && get(userToken)) {
				isLoggedInCustomer = true;
				myOrders = await getCustomerServices();
			}
		} catch (error) {
			console.error(error);
		} finally {
			ordersAreLoading = false;
		}
	});

	const handleGameClick = async (gameId: string) => {
		servicesAreLoading = true;
		try {
			services = await getServicesByGame(gameId);
			servicesFiltered = true;
		} catch (error) {
			console.error(error);
		} finally {
			servicesAreLoading = false;
		}
	};

	const showAllServices = async () => {
		const tempServices = await getAllServices();
		servicesFiltered = false;
		return tempServices;
	};

	const getCustomerServices = async () => {
		const temp = await getOrderByCustomer(get(userData).id, get(userToken));
		console.log(temp);
		return temp;
	};

	const handleOrder = async (serviceId: string) => {
		if (!isCreatingOrder) {
			isCreatingOrder = true;
			targetService = serviceId;
			const token = get(userToken);
			if (!token) {
				goto('/login');
				return;
			}
			try {
				const newOrder = await createOrder(serviceId, token);
				console.log(newOrder);
				toastEnable.set(true);
			} catch (error) {
				console.error(error);
			} finally {
				isCreatingOrder = false;
			}
		}
	};
</script>

<main>
	<section>
		<h2 class="text-2xl font-semibold mx-auto text-center">Available Games</h2>
		<div class="flex rounded-box p-6 gap-6 overflow-x-scroll">
			{#if gamesAreLoading}
				<p>Loading...</p>
			{:else if games.length === 0}
				<p>No games available at this moment.</p>
			{:else}
				{#each games as game (game.id)}
					<div class="card w-[20vw] bg-base-100 shadow-lg shadow-[#ae865f]">
						<figure><img src={game.image} alt="{game.name} image" /></figure>
						<div class="card-body">
							<h2 class="card-title">{game.name}</h2>
							<div class="card-actions justify-end mt-auto">
								<button class="btn btn-ghost" on:click={() => handleGameClick(game.id)}
									>View services</button
								>
							</div>
						</div>
					</div>
				{/each}
			{/if}
		</div>
	</section>

	<section>
		<h2 class="text-2xl font-semibold mx-auto mt-8 text-center">Services</h2>
		<div class="flex rounded-box p-6 gap-6 overflow-x-scroll">
			{#if servicesAreLoading}
				<p>Loading...</p>
			{:else if services.length === 0}
				<p>No services available at this moment.</p>
			{:else}
				{#each services as service (service.id)}
					<div class="card w-[20vw] bg-base-100 shadow-lg shadow-[#ae865f]">
						<figure class="w-full">
							<img src={service.game.image} alt="{service.game.name} image" />
						</figure>
						<div class="card-body justify-between">
							<div class="flex flex-col justify-between">
								<h2 class="card-title">{service.name}</h2>
								<div class="flex flex-col h-min mt-auto">
									<span class="text-sm italic -mb-2 mt-auto">Ditawarkan Oleh:</span>
									<span>{service.helper.firstName} {service.helper.lastName}</span>
									<h3 class="card-title">{rupiahFormatter(service.price)}</h3>
								</div>
							</div>
							<div class="card-actions justify-end">
								<button class="btn btn-neutral" on:click={() => handleOrder(service.id)}>
									{#if isCreatingOrder && targetService === service.id}
										<EosIconsLoading />
									{:else}
										Pesan
									{/if}
								</button>
							</div>
						</div>
					</div>
				{/each}
			{/if}
		</div>
	</section>

	{#if isLoggedInCustomer}
		<section>
			<h2 class="text-2xl font-semibold mx-auto mt-8 text-center">My Orders</h2>
			<div class="flex rounded-box p-6 gap-6 overflow-x-scroll">
				{#if ordersAreLoading}
					<p>Loading...</p>
				{:else if myOrders.length === 0}
					<p>No orders found.</p>
				{:else}
					{#each myOrders as order (order.id)}
						<div class="card w-[20vw] bg-base-100 shadow-lg shadow-[#ae865f]">
							<figure class="w-full">
								<img
									src={order.additionalProperties.service.game.image}
									alt="{order.additionalProperties.service.game.name} image"
								/>
							</figure>
							<div class="card-body">
								<div class="flex flex-row gap-3">
									<img
										class="w-12 h-12 rounded-full"
										src={order.additionalProperties.service.helper.imageUrl}
										alt={order.additionalProperties.service.helper.firstName}
									/>
									<h2 class="card-title">{order.additionalProperties.service.name}</h2>
								</div>

								<div class="flex items-center">
									<div class="text-sm">
										<p class="text-black leading-none">
											{order.additionalProperties.service.game.name}
										</p>
										<p class="text-grey-dark">Order ID: {order.id}</p>
									</div>
								</div>
								<p>Description: {order.additionalProperties.service.description}</p>
								<p>
									Ditawarkan oleh: {order.additionalProperties.service.helper.firstName}
									{order.additionalProperties.service.helper.lastName}
								</p>

								<p>Status: {order.status}</p>
								<p>Total: {rupiahFormatter(order.additionalProperties.service.price)}</p>
								<p>Created At: {new Date(order.createdAt).toLocaleString()}</p>
								<p>Updated At: {new Date(order.updatedAt).toLocaleString()}</p>
							</div>
						</div>
					{/each}
				{/if}
			</div>
		</section>
	{/if}
</main>
