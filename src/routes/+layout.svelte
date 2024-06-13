<script lang='ts'>
	import './styles.css';
	import {onMount, tick} from 'svelte'
	import html2canvas from 'html2canvas';
	import { drawerState, linkColor, highlightColor, bodyColor, imgTagColor, bodyFont, shouldRedraw, renderIsVisible  } from '$stores/store'
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
	let is_rendered:boolean = true

	let debounceTimeout: number | null = null
	let innerDebounceTimeout:number | null = null
	
	let previous_buffered_image:string|null = null
	let buffered_image:string|null = null


  linkColor.subscribe(_val => {triggerRedraw()})
  highlightColor.subscribe(_val => {triggerRedraw()})
  bodyColor.subscribe(_val => {triggerRedraw()})
  imgTagColor.subscribe(_val => {triggerRedraw()})	
	bodyFont.subscribe(_val => {updateRender()})

	onMount(() => {
		is_mounted = true
		
		window.addEventListener('resize', handleResize)
		window.addEventListener('wheel', handleScroll)

		return () => {
			window.removeEventListener('resize', handleResize)
			window.removeEventListener('wheel', handleScroll)
		}
	})
	

  function handleScroll() {
    triggerRedraw(500)
  }	

  function handleResize() {
    triggerRedraw(500)
  }

	function takeScreenshot():Promise<string> {
    return new Promise(async (resolve) => {			
			const html2canvasOptions = {
					imageTimeout: 0,
					scale: 0.5, // Lower the scale to reduce resolution and improve speed
					logging: false, // Disable logging for performance
					allowTaint: true, // Allow tainted canvases (use with caution)
					useCORS: true // Enable CORS to handle images from different origins (if needed)
			};
			const results = await html2canvas(document.getElementById('capture-area') as HTMLCanvasElement, html2canvasOptions);
			// Get the target canvas element
			const targetCanvas = document.getElementById('target-canvas') as HTMLCanvasElement;
			const targetContext = targetCanvas.getContext('2d') as CanvasRenderingContext2D;

			// Set the dimensions of the target canvas
			targetCanvas.width = results.width;
			targetCanvas.height = results.height;
			targetContext.drawImage(results, 0, 0);
					
			targetCanvas.toBlob((blob: Blob | null) => {
				if(blob){
					const reader = new FileReader()
					reader.onload = function(event:ProgressEvent<FileReader>) {
						if (event.target && event.target.result) {
							resolve( event.target.result as string )
						}
					};
					reader.readAsDataURL(blob);						
				}
			},'image/png')			
    });
	}


	async function triggerRedraw(delay: number = 1) {
		if (typeof window !== 'undefined' && !$renderIsVisible) {
				if (debounceTimeout !== null) {
					clearTimeout(debounceTimeout);
				}
				debounceTimeout = setTimeout(async () => {
						if (buffered_image !== null) {
								previous_buffered_image = buffered_image;
								if (innerDebounceTimeout !== null) {
										clearTimeout(innerDebounceTimeout);
								}

								innerDebounceTimeout = setTimeout(() => {
										previous_buffered_image = null;
								}, 700);
						}
						
						buffered_image = null;
						// then replace it with new screen shot
						let imgdata = await takeScreenshot();
						buffered_image = imgdata;
				}, delay);
		}
	}

	function isHiddenVisible(){		
		show_secret = $drawerState.every(item => item === false)
	}

	$:{		
		if($shouldRedraw && is_mounted){
			$shouldRedraw = false
			triggerRedraw()
		}
		

		if(previous_route !== $page.route.id && is_mounted){
			previous_route = String($page.route.id)
			$renderIsVisible = false
			triggerRedraw()
		}

		if(JSON.stringify(previous_drawer_state) !== JSON.stringify($drawerState)){
			previous_drawer_state = $drawerState
			isHiddenVisible()
			triggerRedraw(500)
		}

	}	

  async function updateRender() {
    is_rendered = false
    await tick()
    is_rendered = true
  }  	

</script>

{#if is_rendered}
	<div id="capture-area" class="flex flex-col h-screen w-screen bg-slate-800 overflow-hidden" style='font-family: {$bodyFont.font}'>
		<div class='flex flex-col flex-grow'>
			<TrueHeader />
			<Prompt />
			<MusicPlayer />
		</div>	

		<div class='absolute bottom-40 p-2 w-full flex justify-center {show_secret ? '' : 'hidden'}' >
			<button class='bg-red-600 text-white px-5 py-1 opacity-30 hover:opacity-50 animate-opacity ease duration-300'>???</button>
		</div>

		<div class="h-screen w-screen  border-t-slate-800 border-t-2">
			<Drawers />
		</div>

		<div id="hidden-content" class="hidden">
			<Header />
			<slot></slot>
			<Footer />
		</div>
	</div>
{/if}



<canvas id="target-canvas" class='absolute w-full h-full top-0 left-0 z-10 pointer-events-none hidden'  />
{#if previous_buffered_image !== null}
	<img class='absolute w-full h-full top-0 left-0 pointer-events-none animate-fade-out z-20' src={previous_buffered_image} alt="alt tag" style="transform: translate(-3px, -5px); opacity: 0">
{/if}
{#if buffered_image !== null}
	<img class='absolute w-full h-full top-0 left-0 pointer-events-none z-20 fade-in' alt='test' src={buffered_image} style="transform: translate(-3px, -5px)"/>
{/if}

<style lang='postcss'>
	@keyframes fade-out {
		0% {
			opacity: 0.2
		}
		100% {
			opacity: 0;
		}
	}

	.animate-fade-out {
		animation: fade-out 700ms ease-in-out;
	}


	@keyframes fade-in {
		0% {
			opacity: 0;
		}
		100% {
			opacity: 0.2;
		}
	}


	.fade-in {
		animation: fade-in 700ms ease;
		opacity: 0.2;
	}


  @keyframes shake {
    0% { transform: translateX(0); }
    25% { transform: translateX(0px); }
    50% { transform: translateY(0px); }
    75% { transform: translateX(0px); }
    100% { transform: translateX(0); }
  }

  .animate-shake {
    animation: shake 100ms ease-in-out infinite;
  }
</style>