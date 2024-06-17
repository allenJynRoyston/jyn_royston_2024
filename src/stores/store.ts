import { writable, derived } from 'svelte/store';

// --------------------------
export function saveToLocalStorage(key:string, data:any){
	if (typeof window !== 'undefined' && window.localStorage) {
		localStorage.setItem(key, JSON.stringify(data));
	}
}

export function fetchFromLocalStorage(key:string):any{
	if (typeof window !== 'undefined' && window.localStorage) {
		var res:string | null = localStorage.getItem(key)
		return res === null ? null : JSON.parse(res)
	}
	return null
}
// --------------------------


// --------------------------
export const pageScrollPosition = writable(0)
export const renderIsVisible = writable(false)
export const shouldRedraw = writable(false)
export const shouldReparse = writable(false)
export const closeRender = writable(false)
export const disableKeyboardInput = writable(false)
// --------------------------


// --------------------------
type ModalContent = {
	label: string,
	val: any,
	onClick: (val: any) => void
}

type ModalState = {
	show: boolean
	header?:string
	items?: ModalContent[]
}

function createModalState(defaultState:ModalState = {show:false}) {
	const { subscribe, set, update } = writable(defaultState);

	return {
		subscribe,
		set,
    update: () => update((new_state:ModalState):ModalState => {			
      return new_state;
    }),		
		reset: () => set(defaultState)
	};
}

export type { ModalContent, ModalState };
export const modalState = createModalState()
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
export const drawerSidebarContent = writable("")
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
export const imgTagColor = createTextColor({color: "orange", weight: 700});
export const highlightColor = createTextColor({color: "orange", weight: 300})
// --------------------------

// --------------------------
export type UnlockState = {
	label:string
	state:boolean
}

const unlockStateList:Array<{label:string, var_type?:string}> = [
	{label: "enable_render_mode"},
	{label: "enable_secret_button" },
	{label: "enable_help" },
	{label: "enable_console" },
]

function createCodeState(listData:Array<{label:string, var_type?:string}>) {
	var saved_state:Array<boolean> | null = fetchFromLocalStorage('code')
	
	const defaultState:Array<UnlockState> = listData.map(({var_type = 'let', label}, index) => {
		return {var_type, label, "state": saved_state === null ? index === 0 : saved_state[index] || false}
	})

	const { subscribe, set, update } = writable(defaultState);

	return {
		subscribe,
		set,
		toggle: (key: string, ref: Array<RefItem>, new_val:boolean): Array<RefItem> => {
			// update self
			ref = ref.map((item:any) => ({
				...item,
				state: item.label === key ? new_val : item.state,
      })) 
	
			// save changes
			var stateMap = ref.map(({state}) => {return state})
			saveToLocalStorage('code', stateMap)
			set(ref)
			// return
			return ref
		},		
    update: () => update((new_state) => {
			var stateMap = new_state.map(({state}) => {return state})
			saveToLocalStorage('code', stateMap)
			set(new_state)
      return new_state;
    }),
		reset: () => set(defaultState)
	};
}

export const codeState = createCodeState(unlockStateList)

export const codeStateDict = derived(
  codeState,
  ($codeState: UnlockState[]) => {
    const stateDict: { [key: string]: boolean } = {};
    $codeState.forEach((item) => {
      stateDict[item.label] = item.state;
    });
    return stateDict;
  }
);
// --------------------------


// --------------------------
type RefItem = {
  label: string;
  state: boolean;
};

const consoleUnlockList:Array<{label:string}> = [
	{label: "unlocked_unknown_progress"},
	{label: "unlocked_music_player"},
	{label: "unlocked_hidden_job"},
	{label: "hidden_local_storage_key"},
	{label: "the_lost_ritual"}
]

function createConsoleUnlockedState(listData:Array<{label:string}>) {
	var saved_state:Array<boolean> | null = fetchFromLocalStorage('console')
	
	const defaultState:Array<UnlockState> = listData.map(({label}, index) => {
		return {label, "state": saved_state === null ? false : saved_state[index] || false}
	})

	const { subscribe, set, update } = writable(defaultState);

	return {
		subscribe,
		set,
		unlock: (key: string, ref: Array<RefItem>): Array<RefItem> => {
			// update self
			ref = ref.map((item:any) => ({
				...item,
				state: item.label === key ? true : item.state,
        
      })) 
			debugger
			
			// save changes
			var stateMap = ref.map(({state}) => {return state})
			saveToLocalStorage('console', stateMap)
			set(ref)

			// return
			return ref
		},
    update: () => update((new_state) => {
			var stateMap = new_state.map(({state}) => {return state})
			saveToLocalStorage('console', stateMap)
			set(new_state)
      return new_state;
    }),
		reset: () => set(defaultState)
	};
}

export const consoleUnlockedState = createConsoleUnlockedState(consoleUnlockList)

export const consoleUnlockedStateDict = derived(
  consoleUnlockedState,
  ($consoleUnlockedState: UnlockState[]) => {
    const stateDict: { [key: string]: boolean } = {};
    $consoleUnlockedState.forEach((item) => {
      stateDict[item.label] = item.state;
    });
    return stateDict;
  }
);
// --------------------------


