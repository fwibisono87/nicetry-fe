<script lang="ts">
	import { userData, userToken } from '$lib/stores';
	import { dateFormatter, rupiahFormatter } from '$lib/formatters';
	import EosIconsLoading from '~icons/eos-icons/loading';
	import { onMount } from 'svelte';
	import { get } from 'svelte/store';
	import { getServicesByHelper } from '$lib/services';
	import { getOrdersByHelper } from '$lib/orders';

	import type { Service, Order } from '$lib/types';
	import { goto } from '$app/navigation';

	let myServices: Service[] = [];
	let isLoading = false;

	let myOrders: Order[] = [];
    
    const handleLogout = () => {
        userData.delete()
        userToken.delete()
        goto('/');
    }

	onMount(async () => {
		isLoading = true;
        if(!get(userData) || !get(userToken)) goto('/login')
        else if(get(userData).role !== 'helper') goto('/')
        

		const userID = get(userData).id;
		if (userID) {
			myServices = await getServicesByHelper(userID);
			myOrders = await getOrdersByHelper(userID);
		}
		isLoading = false;
	});
</script>

{#if $userData.email}
	<div class="flex flex-col align-middle justify-center">
		<div class="avatar mx-auto">
			<div
				class=" shadow-[#ae865f] shadow-lg w-24 rounded-full ring ring-[#ae865f] ring-offset-base-100 ring-offset-2"
			>
				<img src={$userData.imageUrl} />
			</div>
		</div>
		<h1 class="mx-auto text-2xl font-semibold mt-2">{$userData.firstName} {$userData.lastName}</h1>
		<span class="mx-auto text-primary -mt-2 mb-6 italic">{$userData.role}</span>
		<table class="mx-auto">
			<tr>
				<td class="font-semibold pr-4">ID</td>
				<td>{$userData.id}</td>
			</tr>
			<tr>
				<td class="font-semibold pr-4">Email</td>
				<td>{$userData.email}</td>
			</tr>
			<tr>
				<td class="font-semibold pr-4">Created At</td>
				<td>{dateFormatter($userData.createdAt)}</td>
			</tr>
			<tr>
				<td class="font-semibold pr-4">Updated At</td>
				<td>{dateFormatter($userData.updatedAt)}</td>
			</tr>
		</table>
        <button class="btn btn-ghost" on:click={handleLogout}>Logout</button>
		<h2 class="text-2xl font-semibold mx-auto mt-8">Your Services</h2>
		{#if !isLoading}
			<div class="grid grid-cols-3 gap-6 mx-auto mt-8">
				<div class="card w-96 bg-base-100 shadow-[#ae865f] shadow-2xl justify-between">
					<div class="card-body">
						<h2 class="card-title">Create new service</h2>

						<div class="card-actions justify-end mt-auto">
							<button
								class="btn btn-neutral"
								on:click={() => {
									goto('/dashboard/services/new');
								}}>Create new</button
							>
						</div>
					</div>
				</div>
				{#each myServices as service}
					<div class="card w-96 bg-base-100 shadow-[#ae865f] shadow-2xl">
						<div class="card-body">
							<h2 class="card-title">{service.name}</h2>
							<span>{service.game.name}</span>
							<span>{rupiahFormatter(service.price)}</span>
							<p>{service.description}</p>
							<div class="card-actions justify-end">
								<button
									class="btn btn-neutral"
									on:click={() => {
										goto('/dashboard/services/' + service.id);
									}}>Detail</button
								>
							</div>
						</div>
					</div>
				{/each}
			</div>
		{:else}
			<div class="flex flex-col align-middle justify-center">
				<EosIconsLoading class="w-24 h-24 mx-auto" />
			</div>
		{/if}
		<h2 class="text-2xl font-semibold mx-auto mt-8">Your Orders</h2>
		{#if !isLoading}
			<div class="grid grid-cols-3 gap-6 mx-auto mt-8">
				{#each myOrders as order}
					<div class="card w-96 bg-base-100 shadow-[#ae865f] shadow-2xl">
						<div class="card-body">
							<span class="text-primary"
								><span class="font-semibold"
									>{order.additionalProperties.customer.firstName}
									{order.additionalProperties.customer.lastName}</span
								> <span class="italic text-primary">memesan:</span></span
							>
							<h2 class="card-title">{order.additionalProperties.service.name}</h2>
							<span>{order.additionalProperties.service.game.name}</span>
							<span>{order.status}</span>
							<span>{rupiahFormatter(order.additionalProperties.service.price)}</span>
							<div class="card-actions justify-end">
								<button
									class="btn btn-neutral"
									on:click={() => {
										goto('/dashboard/orders/' + order.id);
									}}>Detail</button
								>
							</div>
						</div>
					</div>
				{/each}
			</div>
		{:else}
			<div class="flex flex-col align-middle justify-center">
				<EosIconsLoading class="w-24 h-24 mx-auto" />
			</div>
		{/if}
	</div>
{:else}
	<div class="flex flex-col align-middle justify-center">
		<EosIconsLoading class="w-24 h-24 mx-auto" />
	</div>
{/if}
