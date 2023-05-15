import { persist, createLocalStorage } from '@macfja/svelte-persistent-store';
import { writable } from 'svelte/store';
import type { User } from './types';
//let name = persist(writable('John'), createLocalStorage(), 'name');

export let userToken = persist(writable(''), createLocalStorage(), 'userToken');
export let userData = persist(writable({} as User), createLocalStorage(), 'userData');

export let toastEnable = writable(false)
export let toastClass = writable('')
export let toastMsg = writable('dor')