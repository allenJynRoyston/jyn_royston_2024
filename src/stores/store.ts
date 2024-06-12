import { writable, derived } from 'svelte/store';

// --------------------------
function saveToLocalStorage(key:string, data:any){
	if (typeof window !== 'undefined' && window.localStorage) {
		localStorage.setItem(key, JSON.stringify(data));
	}
}

function fetchFromLocalStorage(key:string):any{
	if (typeof window !== 'undefined' && window.localStorage) {
		var res:string | null = localStorage.getItem(key)
		return res === null ? null : JSON.parse(res)
	}
	return null
}
// --------------------------


// --------------------------
export const shouldRedraw = writable(false)
export const shouldReparse = writable(false)
// --------------------------


// --------------------------
function createDrawerState(defaultState:Array<boolean> = [true, false, false]) {
	var saved_state:Array<boolean> | null = fetchFromLocalStorage('drawer_state')

	const { subscribe, set, update } = writable(saved_state === null ? defaultState : saved_state);

	return {
		subscribe,
		set,
    update: () => update((new_state) => {			
			saveToLocalStorage('drawer_state', new_state)			
      return new_state;
    }),		
		// update: (new_state:Array<boolean>) => update((state:Array<boolean>) => state = new_state),
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

// --------------------------
export type UnlockState = {
	label:string
	state:boolean
}

const unlockStateList:Array<{label:string, var_type?:string}> = [
	{label: "secrets_are_safe", var_type: 'const'},
	{label: "enable_help" },
	{label: "enable_console" },
	{label: "extra_style_options" },
]



function createUnlockedState(listData:Array<{label:string, var_type?:string}>) {
	var saved_state:Array<boolean> | null = fetchFromLocalStorage('unlockables')
	

	const defaultState:Array<UnlockState> = listData.map(({var_type = 'let', label}, index) => {
		return {var_type, label, "state": saved_state === null ? false : saved_state[index]}
	})

	const { subscribe, set, update } = writable(defaultState);

	return {
		subscribe,
		set,
    update: () => update((new_state) => {
			var stateMap = new_state.map(({state}) => {return state})
			saveToLocalStorage('unlockables', stateMap)
      return new_state;
    }),
		reset: () => set(defaultState)
	};
}

export const unlockedState = createUnlockedState(unlockStateList)

export const unlockedStateDict = derived(
  unlockedState,
  ($unlockedState: UnlockState[]) => {
    const stateDict: { [key: string]: boolean } = {};
    $unlockedState.forEach((item) => {
      stateDict[item.label] = item.state;
    });
    return stateDict;
  }
);
// --------------------------




