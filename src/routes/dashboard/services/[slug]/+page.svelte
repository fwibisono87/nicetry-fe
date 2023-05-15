<script lang="ts">
	import { userData, userToken } from '$lib/stores';
	import { dateFormatter, rupiahFormatter } from '$lib/formatters';
	import EosIconsLoading from '~icons/eos-icons/loading';
	import { onMount } from 'svelte';
	import { get } from 'svelte/store';
	import { getServiceById, updateServiceById } from '$lib/services';
	import type { Service } from '$lib/types';

	import { page } from '$app/stores';

	let myService: Service;
	let isLoading = true;

	let isEditing = false;
	let editedService:{
        name: string;
        description: string;
        price: number;
        gameId: string;
    };

	const handleEdit = () => {
		isEditing = true;
        editedService = {
            name: myService.name,
            description: myService.description,
            price: myService.price,
            gameId: myService.game.id
        };
	};

	const handleSubmit = async () => {
		isLoading = true;
		const token = get(userToken);
		await updateServiceById(myService.id, token, editedService);
        await getServiceData();
		isEditing = false;
		isLoading = false;
	};

	const handleCancel = () => {
		isEditing = false;
	};

    const getServiceData = async () => {
        isLoading = true;
		const user = get(userData);
		if (user.role !== 'user') {
			const id = get(page).params.slug;
			myService = await getServiceById(id);
		}
		console.log(myService);
		isLoading = false;
    }

	onMount(async () => {
		await getServiceData();
	});
</script>

<div class="flex flex-col justify-center align-middle h-[85%]">
{#if !isLoading}
	{#if isEditing}
		<!-- Form for editing the service -->
		<div class="card shadow-[#ae865f] shadow-2xl mx-auto">
			<figure>
				<img src={myService?.game?.image} alt={myService?.game.name} class="h-[100%]" />
			</figure>
			<div class="card-body">
				<input bind:value={editedService.name} placeholder="Name" />
				<input bind:value={editedService.description} placeholder="Description" />
				<input bind:value={editedService.price} placeholder="Price" type="number" min="0" />
				<button class="btn " on:click={handleSubmit}>Submit</button>
				<button class="btn btn-ghost" on:click={handleCancel}>Cancel</button>
			</div>
		</div>
	{:else}
		<div class="card shadow-[#ae865f] shadow-2xl mx-auto">
			<figure class="">
				<img src={myService?.game?.image} alt={myService?.game.name} class="h-[100%]" />
			</figure>
			<div class="card-body">
				<h2 class="card-title">{myService.name}</h2>
				<span class="text-primary italic -mt-2">{myService.id}</span>
				<span class="card-subtitle">{myService?.game?.name}</span>
				<span>{rupiahFormatter(myService.price)}</span>
				<span>{dateFormatter(myService.createdAt)} - {dateFormatter(myService.updatedAt)}</span>
				<p>{myService.description}</p>
				<div class="card-actions justify-end">
					<button class="btn btn-primary" on:click={handleEdit}>Edit</button>
				</div>
			</div>
		</div>
	{/if}
{:else}
	<div class="flex flex-col align-middle justify-center">
		<!-- <EosIconsLoading class="w-24 h-24 mx-auto" /> -->
        <span>Loading...</span>
	</div>
{/if}
</div>