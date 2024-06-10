<script lang='ts'>
	import './styles.css';
	import {onMount, onDestroy, tick} from 'svelte'
	import html2canvas from 'html2canvas';
	import { drawerState, drawerSidebarState, linkColor, highlightColor, bodyColor, imgTagColor, bodyFont  } from '$stores/store'
	import { page } from '$app/stores';

	import Drawers from '$components/Drawers.svelte'
	import Header from '$components/Header.svelte';	
	import Footer from '$components/Footer.svelte';	
  import { fade } from 'svelte/transition';

	let previous_route:String
	let previous_drawer_state:Array<boolean> = []
	let previous_drawer_sidebar_state:boolean = false
	let is_mounted:boolean = false
	let is_animating:boolean = false
	let is_updating:boolean = false
	let fade_duration:number = 300
  let timeoutId;

	bodyFont.subscribe(_val => {triggerRedraw()})
  linkColor.subscribe(_val => {triggerRedraw()})
  highlightColor.subscribe(_val => {triggerRedraw()})
  bodyColor.subscribe(_val => {triggerRedraw()})
  imgTagColor.subscribe(_val => {triggerRedraw()})	

	onMount(() => {
		is_mounted = true
		renderContentOnCanvas()
		window.addEventListener('resize', handleResize)
		return () => {
			window.removeEventListener('resize', handleResize)
		}
	})
	

  function handleResize() {
    // Clear any existing timeout
    clearTimeout(timeoutId);
    // Set a new timeout to handle the resize event after 300ms (adjust as needed)
    timeoutId = setTimeout(() => {
			triggerRedraw()
    }, 500); 
  }


  async function renderContentOnCanvas() {
    try {
			if(!is_updating){
				// Capture the content of the entire document
				is_updating = true
				console.log("here")
				const canvas =  await html2canvas(document.getElementById('capture-area'))
				
				// Get the target canvas element
				const targetCanvas = document.getElementById('target-canvas');
				const targetContext = targetCanvas.getContext('2d');

				// Set the dimensions of the target canvas
				targetCanvas.width = canvas.width;
				targetCanvas.height = canvas.height;
				targetContext.drawImage(canvas, 2, -5)
				
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

	$:{
		if(previous_route !== $page.route.id && is_mounted){
			previous_route = String($page.route.id)
			triggerRedraw()
		}

		if(JSON.stringify(previous_drawer_state) !== JSON.stringify($drawerState)){
			previous_drawer_state = $drawerState
			triggerRedraw(500)
		}

		if(previous_drawer_sidebar_state !== $drawerSidebarState){
			previous_drawer_sidebar_state = $drawerSidebarState			
			triggerRedraw(500)
		}		
	}	

</script>


<div class="flex flex-col h-screen w-screen bg-slate-800 overflow-hidden gap-1">
	<div id="capture-area" class="h-screen w-screen">
		<Drawers />
	</div>

	<div id="hidden-content" class="hidden">
		<Header />
		<slot></slot>
		<Footer />
	</div>
</div>


<canvas id="target-canvas" class='animate-shake absolute w-full h-full top-0 left-0 z-10 pointer-events-none transition-opacity ease-in-out {is_animating ? 'opacity-20' : is_updating ? 'opacity-0' : 'opacity-30'}' willReadFrequently={true} style="transition-duration: {fade_duration}ms" />


<style lang='postcss'>
  @keyframes shake {
    0% { transform: translateX(0); }
    25% { transform: translateX(1px); }
    50% { transform: translateY(0px); }
    75% { transform: translateX(0px); }
    100% { transform: translateX(0); }
  }

  .animate-shake {
    animation: shake 0.1s ease infinite;
  }
</style>