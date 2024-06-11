import { writable } from 'svelte/store';

// --------------------------
export const shouldRedraw = writable(false)
// --------------------------


// --------------------------
function createDrawerState(defaultState:Array<boolean> = [true, false, false]) {
	const { subscribe, set, update } = writable(defaultState);

	return {
		subscribe,
		update: (new_state:Array<boolean>) => update((state:Array<boolean>) => state = new_state),
		reset: () => set(defaultState)
	};
}

export const drawerState = createDrawerState()
export const drawerSidebarState = writable(false)
// --------------------------


// --------------------------
type HTMLFontState = {
	font: string
}

function createBodyFont(defaultState:HTMLFontState) {
	const { subscribe, set, update } = writable(defaultState);

	return {
		subscribe,
		update: (new_state:HTMLFontState) => update((state:HTMLFontState) => state = new_state),
		reset: () => set(defaultState)
	};
}

export const bodyFont = createBodyFont({"font": '"Ubuntu Mono", monospace'})
// --------------------------


// --------------------------
type ColorState = {
  color: string;
  weight: number;
}

function createTextColor(defaultState:ColorState) {
	const { subscribe, set, update } = writable(defaultState);

	return {
		subscribe,
		update: (new_state:ColorState) => update((state:ColorState) => state = new_state),
		reset: () => set(defaultState)
	};
}

export const bodyColor = createTextColor({color: "neutral", weight: 200})
export const linkColor = createTextColor({color: "orange", weight: 500});
export const imgTagColor = createTextColor({color: "blue", weight: 500});
export const highlightColor = createTextColor({color: "green", weight: 500})
// --------------------------