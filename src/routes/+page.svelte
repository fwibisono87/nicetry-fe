<script lang="ts">
	import { onMount } from 'svelte';
	import { getAllGames, getAllServices, getServicesByGame } from '$lib/services';
	import { createOrder } from '$lib/orders';
	import type { Game, Service } from '$lib/types';
	import { rupiahFormatter } from '$lib/formatters';
	import { toastEnable, userToken } from '$lib/stores'; // import the userToken from the store
	import { get } from 'svelte/store'; // import the get function from svelte/store
	import { goto } from '$app/navigation'; // import the goto function for navigation
	import EosIconsLoading from '~icons/eos-icons/loading';

	let games: Game[] = [];
	let services: Service[] = [];
	let servicesFiltered = false;
	let isCreatingOrder = false;
    let targetService = '';

	onMount(async () => {
		games = await getAllGames();
		services = await showAllServices();
	});

	const handleGameClick = async (gameId: string) => {
		services = await getServicesByGame(gameId);
		servicesFiltered = true;
	};
	const showAllServices = async () => {
		const tempServices = await getAllServices();
		servicesFiltered = false;
		return tempServices;
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
			}
			isCreatingOrder = false;
		}
	};
</script>

<h2 class="text-2xl font-semibold mx-auto">Available Games</h2>
<div class="flex rounded-box p-6 gap-6 overflow-x-scroll">
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
</div>

<h2 class="text-2xl font-semibold mx-auto mt-8">Services</h2>
<div class="flex rounded-box p-6 gap-6 overflow-x-scroll">
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
						{#if isCreatingOrder && targetService===service.id}
							<EosIconsLoading />
						{:else}
							Pesan
						{/if}
					</button>
				</div>
			</div>
		</div>
	{/each}
</div>
