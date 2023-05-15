<script lang="ts">
	import { userData, userToken } from '$lib/stores';
	import { onMount } from 'svelte';
	import { get } from 'svelte/store';
	import { createService, getAllGames } from '$lib/services';
	import type { Game, ServiceRequestDTO } from '$lib/types';

	let isLoading = true;
	let newService: Partial<ServiceRequestDTO> = {};
	let games: Game[] = [];

	const handleCreate = async () => {
		isLoading = true;
		const token = get(userToken);
		await createService(newService, token);
		isLoading = false;
	};

	onMount(async () => {
		isLoading = true;
		games = await getAllGames();
		isLoading = false;
	});
</script>

{#if !isLoading}
	<div class="card shadow-[#ae865f] shadow-2xl mx-auto">
		<div class="card-body">
			<h2 class="card-title">Create a new service</h2>
			<input bind:value={newService.name} placeholder="Name" />
			<input bind:value={newService.description} placeholder="Description" />
			<input bind:value={newService.price} placeholder="Price" type="number" min="0" />
			<select bind:value={newService.gameId}>
				<option value="">--Please choose a game--</option>
				{#each games as game (game.id)}
					<option value={game.id}>{game.name}</option>
				{/each}
			</select>
			<button class="btn" on:click={handleCreate}>Create</button>
		</div>
	</div>
{:else}
	<div class="flex flex-col align-middle justify-center">Loading...</div>
{/if}

<style lang="scss">
	input {
		@apply px-4 py-2 rounded-md;
	}
	select {
		@apply px-4 py-2 rounded-md;
	}
</style>
