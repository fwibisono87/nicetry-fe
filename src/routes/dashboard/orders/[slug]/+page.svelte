<script lang="ts">
	import { userData, userToken } from '$lib/stores';
	import { dateFormatter } from '$lib/formatters';
	import EosIconsLoading from '~icons/eos-icons/loading';
	import { onMount } from 'svelte';
	import { get } from 'svelte/store';
	import { getOrderById, updateOrderStatusById } from '$lib/services';
	import type { Order } from '$lib/types';

	import { page } from '$app/stores';

	let myOrder: Order;
	let isLoading = true;

	let isEditing = false;
	let editedStatus: string;

	const handleEdit = () => {
		isEditing = true;
		editedStatus = myOrder.status;
	};

	const handleSubmit = async () => {
		isLoading = true;
		const token = get(userToken);
		await updateOrderStatusById(myOrder.id, token, editedStatus);
		await getOrderData();
		isEditing = false;
		isLoading = false;
	};

	const handleCancel = () => {
		isEditing = false;
	};

	const getOrderData = async () => {
		isLoading = true;
		const user = get(userData);
		if (user.role !== 'user') {
			const id = get(page).params.slug;
			myOrder = await getOrderById(id);
		}
		console.log(myOrder);
		isLoading = false;
	}

	onMount(async () => {
		await getOrderData();
	});
</script>

<div class="flex flex-col justify-center align-middle h-[85%]">
	{#if !isLoading}
		{#if isEditing}
			<!-- Form for editing the order status -->
			<div class="card shadow-[#ae865f] shadow-2xl mx-auto">
				<div class="card-body">
                    <select bind:value={editedStatus}>
                        <option value="created">Created</option>
                        <option value="pending">Pending</option>
                        <option value="done">Done</option>
                    </select>
					<button class="btn" on:click={handleSubmit}>Submit</button>
					<button class="btn btn-ghost" on:click={handleCancel}>Cancel</button>
				</div>
			</div>
		{:else}
			<div class="card shadow-[#ae865f] shadow-2xl mx-auto">
				<div class="card-body">
                    <span class="text-primary"><span class="font-semibold">{myOrder.additionalProperties.customer.firstName} {myOrder.additionalProperties.customer.lastName}</span> <span class="italic text-primary">memesan:</span></span>
					<span class="text-primary italic -mt-2">{myOrder.id}</span>
					<p>Status: {myOrder.status}</p>
					<p>Service: {myOrder.additionalProperties.service.name}</p>
					<span>{dateFormatter(myOrder.createdAt)} - {dateFormatter(myOrder.updatedAt)}</span>
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