<script lang='ts'>
	import './styles.css';
	import {onMount, tick} from 'svelte'
	import html2canvas from 'html2canvas';
	import { drawerState, linkColor, highlightColor, bodyColor, imgTagColor, bodyFont, shouldRedraw  } from '$stores/store'
	import { page } from '$app/stores';

	import TrueHeader from '$components/TrueHeader.svelte'
	import Drawers from '$components/Drawers.svelte'
	import Header from '$components/Header.svelte'	
	import Footer from '$components/Footer.svelte'	
	import Prompt from '$components/Prompt.svelte'
	import MusicPlayer from '$components/MusicPlayer.svelte';
 
	let previous_route:String
	let previous_drawer_state:Array<boolean> = []
	let show_secret:boolean = false
	let is_mounted:boolean = false
	let is_animating:boolean = false
	let is_updating:boolean = false
	let fade_duration:number = 300
  let timeoutId:any

	bodyFont.subscribe(_val => {triggerRedraw()})
  linkColor.subscribe(_val => {triggerRedraw()})
  highlightColor.subscribe(_val => {triggerRedraw()})
  bodyColor.subscribe(_val => {triggerRedraw()})
  imgTagColor.subscribe(_val => {triggerRedraw()})	

	onMount(() => {
		is_mounted = true
		
		window.addEventListener('resize', handleResize)
		window.addEventListener('wheel', handleScroll)

		return () => {
			window.removeEventListener('resize', handleResize)
			window.removeEventListener('wheel', handleScroll)
		}
	})
	
  function redraw(duration:number = 250) {
    // Clear any existing timeout
    clearTimeout(timeoutId);
    // Set a new timeout to handle the resize event after 300ms (adjust as needed)
    timeoutId = setTimeout(() => {
			triggerRedraw()
    }, 250); 
  }	

  function handleScroll() {
    redraw()
  }	

  function handleResize() {
    redraw(500)
  }


  async function renderContentOnCanvas() {
    try {
			if(!is_updating){
				// Capture the content of the entire document
				is_updating = true				
				const canvas =  await html2canvas(document.getElementById('capture-area'))
				
				// Get the target canvas element
				const targetCanvas = document.getElementById('target-canvas');
				const targetContext = targetCanvas.getContext('2d');

				// Set the dimensions of the target canvas
				targetCanvas.width = canvas.width;
				targetCanvas.height = canvas.height;
				targetContext.drawImage(canvas, 3, -4)
				
				await tick()
				is_updating = false
			}

    } catch (error) {
      console.error('Error rendering content on canvas:', error);
    }
  }

	function triggerRedraw(duration:number = fade_duration){
		if(!is_animating){
			is_animating = true
			setTimeout(() => {
				is_animating = false
				renderContentOnCanvas()
			}, duration)		
		}
	}

	function isHiddenVisible(){		
		show_secret = $drawerState.every(item => item === false)
		console.log("show_secret: ", show_secret)
	}

	$:{		
		if($shouldRedraw){
			$shouldRedraw = false
			redraw()
		}
		

		if(previous_route !== $page.route.id && is_mounted){
			previous_route = String($page.route.id)
			triggerRedraw()
		}

		if(JSON.stringify(previous_drawer_state) !== JSON.stringify($drawerState)){
			previous_drawer_state = $drawerState
			isHiddenVisible()
			triggerRedraw(500)
		}

	}	

</script>


<div id="capture-area" class="flex flex-col h-screen w-screen bg-slate-800 overflow-hidden gap-1 min-w-[900px]">
	<TrueHeader />
	<Prompt />

	<div class='absolute bottom-20 p-2 w-full flex justify-center {show_secret ? '' : 'hidden'}' >
			<button class='bg-red-600 text-white px-5 py-1 opacity-30 hover:opacity-50 animate-opacity easea duration-300'>???</button>
	</div>

	<div class="h-screen w-screen min-w-[900px]">
		<Drawers />
	</div>

	<div id="hidden-content" class="hidden">
		<Header />
		<slot></slot>
		<Footer />
	</div>

	<MusicPlayer />

</div>


<canvas id="target-canvas" class='animate-shake absolute w-full h-full top-0 left-0 z-10 pointer-events-none transition-opacity ease {is_animating ? 'opacity-20' : is_updating ? 'opacity-0' : 'opacity-20'}' willReadFrequently style="transition-duration: {fade_duration}ms" />


<style lang='postcss'>
  @keyframes shake {
    0% { transform: translateX(0); }
    25% { transform: translateX(0px); }
    50% { transform: translateY(-1px); }
    75% { transform: translateX(0px); }
    100% { transform: translateX(0); }
  }

  .animate-shake {
    animation: shake 100ms ease-in-out infinite;
  }
</style>