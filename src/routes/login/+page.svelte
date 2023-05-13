<script>
	import { onMount } from 'svelte';
    /** @type {import('$types').PageData} */
    import {test} from '../../lib/auth'

    let testData

    onMount(async () => {
        testData = await test()
        console.log(testData)
    })

    export let data;

  </script>
  
  {#if data}
    <div class="flex flex-col gap-4 mx-auto">
      <h1 class="text-center text-2xl font-semibold">Login</h1>
      <div class="flex flex-col gap-2">
        <input type="text" placeholder="Username" class="input input-bordered w-full max-w-xs" />
        <input type="text" placeholder="Password" class="input input-bordered w-full max-w-xs" />
      </div>
    </div>
  {:else}
    <div>Loading...</div>
  {/if}
  