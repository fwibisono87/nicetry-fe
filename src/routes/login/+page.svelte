<script>
	import { onMount } from 'svelte';
	import { login, verifyJWT } from '../../lib/auth';
	import { userToken, userData } from '../../lib/stores';
	import { get } from 'svelte/store';
	import { goto } from '$app/navigation';

	let testData;

	// onMount(async () => {
	// 	try {
	// 		let data = await verifyJWT(get(userToken));
	// 		console.log(data)
	// 		if (!data.status == '500') {
	// 			goto('dashboard');
	// 		}
	// 	} catch {
	// 		// do nothing
	// 	}
	// });

	let username = '';
	let password = '';

	let isLoading = false;
	$: msg = '';

	async function handleLogin() {
		try {
			msg = '';
			let token = await login(username, password);
			if (token) {
				userToken.set(token.token.toString());
				isLoading = false;
				let userDataResponse = await verifyJWT(token.token);
				userData.set(userDataResponse);

				msg = `Login successful! Welcome ${get(userData).firstName}!`;
			}
		} catch (e) {
			if (e instanceof Error) {
				msg = e.message;
			}
			isLoading = false;
		}
	}
</script>

{#if !isLoading}
	<form class="flex flex-col gap-4 mx-auto">
		<h1 class="text-center text-2xl font-semibold">Login</h1>
		<div class="flex flex-col gap-2">
			<input
				bind:value={username}
				type="text"
				placeholder="Username"
				class="input input-bordered w-full max-w-xs"
			/>
			<input
				bind:value={password}
				type="password"
				placeholder="Password"
				class="input input-bordered w-full max-w-xs"
			/>
		</div>
		<button class="btn" on:click={handleLogin}>Login</button>
		<span class="text-center">{msg}</span>
	</form>
{:else}
	<div>Loading...</div>
{/if}
