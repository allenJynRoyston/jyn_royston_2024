<script lang='ts'>
  import { Confetti } from "svelte-confetti"
  import {onMount} from 'svelte'
  import { page } from '$app/stores';
  import { spring, tweened  } from 'svelte/motion';
  import {shouldRedraw, renderIsVisible} from '$stores/store'
  import IconParkOutlineLoadingThree from '~icons/icon-park-outline/loading-three';
  import CarbonCloseOutline from '~icons/carbon/close-outline';

  import CanvasFx from '$components/CanvasFX.svelte';
  export let show:boolean = false
  export let content:string|null 

  let is_animating:boolean = false

  interface ClassStyles {
    [key: string]: string; // Key is class name, value is corresponding inline style
  }

  interface TagStyles {
    [key: string]: string; // Key is tag name, value is corresponding inline style
  }

  const classStyles: ClassStyles = {
    'text-xl': 'font-size: 1.25rem;', // Example: converts Tailwind text-xl to inline style
    'bg-gray-200': 'background-color: #edf2f7;', // Example: converts Tailwind bg-gray-200 to inline style
    // Add more Tailwind classes and styles as needed
  };

  const tagStyles:TagStyles = {
    h1: 'font-size: 2rem; font-weight: bold', // Example: converts <h1> to inline style
    h2: 'font-size: 1.5rem; font-weight: bold; margin-bottom: 0.75rem;', // Example: converts <h2> to inline style
    h3: 'font-size: 1.25rem; font-weight: bold; margin-bottom: 0.5rem;', // Example: converts <h3> to inline style
    p: 'font-size: 0.85rem; line-height: 1.5; margin-bottom: 1rem;', // Example: converts <p> to inline style
    ul: 'padding-left: 1.5rem; margin: 1rem;', // Example: converts <ul> to inline style
    li: 'font-size: 0.85rem; list-style-type: disc; margin-bottom: 0.5rem;', // Example: converts <li> to inline style
    img: 'display: block; margin: 0 auto; max-width: 100%; padding-bottom: 10px', // Ensure images are always centered
    a: 'font-size: 0.85rem; line-height: 1.5; color: orange',    
    // Add more tag-specific styles as needed
  };

  onMount(() => {
    window.addEventListener('keydown', handleKeydown);

		return () => {
			window.removeEventListener('keydown', handleKeydown)
		}   
  })

  function handleKeydown(event:KeyboardEvent) {
    if (event.key === 'Delete' && show && !is_animating) {
      $renderIsVisible = false
      $shouldRedraw = true
    }
  }


  function parseContent(content:string|null){
    if(content === null){
      return ""
    }
    return processHTML(content)
  }



  function processHTML(html: string): string {
    // Regular expression to match class attributes
    const classRegex = /class="([^"]+)"/g;

    // Replace classes with inline styles
    const replacedHTML = html.replace(classRegex, (match: string, classes: string) => {
      // Split classes into an array
      const classList = classes.split(' ');

      // Check each class and replace with corresponding style if exists
      const updatedClasses = classList.map(cls => {
        if (classStyles[cls]) {
          return `style="${classStyles[cls]}"`;
        } else {
          return `class="${cls}"`; // If no matching style, keep the original class
        }
      });

      // Join the updated classes back into a string
      return updatedClasses.join(' ');
    });

    // Regular expression to match tag attributes
    const tagRegex = /<(\/?)(\w+)([^>]*)>/g;

    // Replace tags with inline styles
    const finalHTML = replacedHTML.replace(tagRegex, (match: string, closeTag: string, tagName: string, attributes: string) => {
      if (closeTag === '/') {
        return `</${tagName}>`; // Return closing tag as is
      } else {
        // Check if there's a specific style for this tag
        const style = tagStyles[tagName.toLowerCase()];

        if (style) {
          return `<${tagName} style="${style}"${attributes}>`; // Replace with tag and style
        } 

        return match; // Return original tag if no specific style found        
      }
    });

    return finalHTML;
  }  


  let pos = spring({ x: 0, y: 0 }, { stiffness: 0.1, damping: 0.25 });
  let opacity = tweened (0, { duration: 1000 });
  let loadingbar = tweened (0, { duration: 700 });

  $:{
    if(show){
      opacity = tweened (0, { duration: 1000 });
      loadingbar = tweened (0, { duration: 700 });

      is_animating = true
      pos.set({ x: 0, y: 50 });
      loadingbar.set(100)
      setTimeout(() => {
        is_animating = false
        opacity.set(1)
      }, 1000)
    }
    else{
      opacity = tweened (0, { duration: 0 });
      loadingbar = tweened (0, { duration: 0 });

      pos.set({ x: 0, y: 0 })
      opacity.set(0)
      loadingbar.set(0)
    }
  }

</script>


<div id='render-content' class="fixed flex items-center justify-center top-0 left-0 w-full h-full bg-black text-white {show ? 'z-50' : '-z-10'}" >

  {#if show && !is_animating}
    <CanvasFx />
  {/if}


  <div class="w-full h-full overflow-hidden overflow-y-auto p-4 z-30" style="opacity: {$opacity}">
    {@html parseContent(content)}   
  </div>

  {#if show && !is_animating}
    <div class="absolute top-0 right-2 flex items-center justify-center z-50">
      <button class='text-xl p-5 ease duration-300 hover:text-red-600 transition-color' on:click={() => {$renderIsVisible = false}}>
        <CarbonCloseOutline />
      </button>
    </div>

    {#if $page.route.id === "/"}
      <div class="absolute w-full h-full left-0 z-50 pointer-events-none" style="top: -50px">
        <Confetti x={[-5, 5]} y={[0, 0.1]} delay={[500, 2000]} infinite duration={5000} amount={200} fallDistance="100vh" />
      </div>

      <div class="absolute w-full h-full left-0 z-10 pointer-events-none" style="top: -50px">
        <Confetti x={[-5, 5]} y={[0, 0.1]} delay={[500, 2000]} infinite duration={5000} amount={200} fallDistance="100vh" />
      </div>    
    {/if}
  {/if}  

  
  {#if is_animating}
    <div class="modal absolute bg-slate-300 text-black px-10 py-5 flex flex-col gap-1 items-center justify-center" style="transform: translate({$pos.x}px, {$pos.y-100}px);">
      <p class='text-xs'>Rendering beginning...</p>
      <div class='flex w-full gap-2 items-center justify-center'>
        <IconParkOutlineLoadingThree class='animate-spin' />
        <div class="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">        
          <div class="bg-blue-600 h-2.5 rounded-full" style="width: {$loadingbar}%"></div>
        </div>      
      </div>
    </div>
  {/if}
</div>

