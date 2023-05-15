<script>
	import '../app.css';
	import { page } from '$app/stores';
	import { get } from 'svelte/store';
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { userToken, userData, toastClass, toastEnable, toastMsg } from '$lib/stores';
	import { verifyJWT } from '$lib/auth';

	const logout = () => {
		userData.delete();
		userToken.delete();
	};

	let previousToastStatus = false;

	const toastTimeout = () => {
		setTimeout(() => {
			toastEnable.set(false);
		}, 5000);
	}

	onMount(async () => {
		const ignoredPaths = ['/login', '/register'];

		let path = get(page).url.pathname;
		if (!ignoredPaths.includes(path)) {
			console.log('ini', get(userData));
			console.info('checking login information');
			let token = get(userToken);
			if (!token) {
				console.info('no token found, redirecting to login');
				goto('/login');
			} else {
				try {
					if (!get(userToken)) throw new Error('no token found, redirecting to login');
					let userDataResponse = await verifyJWT(token);
					userData.set(userDataResponse);
				} catch {
					console.info('cannot verify identity, redirecting to login');
					userToken.delete();
					goto('/login');
				}
			}
		} else {
			logout();
		}

		const unsubscribe = toastEnable.subscribe((value) => {
			if (value === true && previousToastStatus === false) {
				// The store has changed from false to true
				toastTimeout();
			}
			previousToastStatus = value;
		});
	});
</script>

<div class="flex flex-col max-w-screen min-h-screen">
	<div class="navbar bg-base-100 sticky top-0 z-[499]">
		<div class="flex-1">
			<a href="/" class="btn btn-ghost normal-case text-xl"
				>NiceTry <span class="ml-2 text-xs text-primary mt-0 mb-auto font-medium animate-bounce"
					>peko!</span
				></a
			>
		</div>
		<div class="flex-none">
			<ul class="menu menu-horizontal px-1">
				<!-- <li tabindex="0">
              <a>
                Parent
                <svg class="fill-current" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"><path d="M7.41,8.58L12,13.17L16.59,8.58L18,10L12,16L6,10L7.41,8.58Z"/></svg>
              </a>
              <ul class="p-2 bg-base-100">
                <li><a>Submenu 1</a></li>
                <li><a>Submenu 2</a></li>
              </ul>
            </li> -->
				{#if $userToken}
					<li><a href="/dashboard">Hello, {$userData.firstName}!</a></li>
					{#if $userData.role}
						<li><span on:click={() => logout()}>Logout</span></li>
					{/if}
				{:else}
					<li><a href="/login">Login</a></li>
				{/if}
				<!-- {$toastEnable} -->
			</ul>
		</div>
	</div>
	{#if $toastEnable}
	<div class="alert alert-success shadow-lg sticky top-0 z-[500] w-[80%] mx-auto">
		<div>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				class="stroke-current flex-shrink-0 h-6 w-6"
				fill="none"
				viewBox="0 0 24 24"
				><path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
				/></svg
			>
			<span>Your purchase has been confirmed!</span>
		</div>
	</div>
	{/if}
	<slot />
</div>
