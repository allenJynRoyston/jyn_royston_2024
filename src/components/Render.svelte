<script lang='ts'>
  import { Confetti } from "svelte-confetti"
  import {onMount} from 'svelte'
  import { page } from '$app/stores';
  import { spring, tweened  } from 'svelte/motion';
  import {shouldRedraw, renderIsVisible, consoleUnlockedState, consoleUnlockedStateDict} from '$stores/store'
  import PopupFrame from '$components/PopupFrame.svelte'
  import IconParkOutlineLoadingThree from '~icons/icon-park-outline/loading-three';
  import CarbonCloseOutline from '~icons/carbon/close-outline';

  import CanvasFx from '$components/CanvasFX.svelte';
  export let show:boolean = false
  export let content:string|null 

  let is_animating:boolean = false
  let opacity = tweened (0, { duration: 1000 });
  let loadingbar = tweened (0, { duration: 700 });  
  let pos = spring({ x: 0, y: 0 }, { stiffness: 0.1, damping: 0.2 });
  let secrets_found:number = 0

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

  function onAnimationComplete(){
    is_animating = false
    opacity.set(1)
    pos.set({ x: 10, y: 0 });
  }



  $:{
    if(show){
      // on show, set animation to true and start loadingbar/opacity fade in
      opacity = tweened (0, { duration: 700 });
      loadingbar = tweened (0, { duration: 600 });
      is_animating = true
      loadingbar.set(100)
    }
    else{
      // reset to 0 
      opacity = tweened (0, { duration: 0 });
      loadingbar = tweened (0, { duration: 0 });
      pos.set({ x: 0, y: 0 });
      opacity.set(0)
      loadingbar.set(0)
    }

    secrets_found = $consoleUnlockedState.filter(item => item.state === true).length
  }

</script>


<div id='render-content' class="fixed flex items-center justify-center top-0 left-0 w-full h-full bg-black text-white {show ? 'z-50 opacity-90' : '-z-10 hidden'}" >

  {#if show && !is_animating}
    <CanvasFx />
  {/if}


  <div class="w-full h-full overflow-hidden overflow-y-auto p-4 z-30" style="opacity: {$opacity}; transform: translate({$pos.x-10}px, {$pos.y}px)">
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
     <PopupFrame show={is_animating} {onAnimationComplete} >
      <p class='text-xs'>Rendering beginning...</p>
      <div class='flex w-full gap-2 items-center justify-center'>
        <IconParkOutlineLoadingThree class='animate-spin' />
        <div class="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">        
          <div class="bg-blue-600 h-2.5 rounded-full" style="width: {$loadingbar}%"></div>
        </div>      
      </div>
    </PopupFrame>  
  {/if}

  <img alt='🔑 RELEASE_THE_LAST_SEAL' data-notes="Awesome image can be found here: https://www.deviantart.com/undeaddxll/art/Eldritch-Horror-Oracle-924979563" class='fixed top-0 left-0 pointer-events-none w-full h-auto min-w-[1080px]' style="opacity: {secrets_found > 0 ? (secrets_found * 0.05) : 0.05}"  src='https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/c4037587-3e55-4d20-aad2-d3c2f85d2941/dfapisr-a0d089d9-c919-4eba-a2d2-9c5345a49e64.jpg?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7InBhdGgiOiJcL2ZcL2M0MDM3NTg3LTNlNTUtNGQyMC1hYWQyLWQzYzJmODVkMjk0MVwvZGZhcGlzci1hMGQwODlkOS1jOTE5LTRlYmEtYTJkMi05YzUzNDVhNDllNjQuanBnIn1dXSwiYXVkIjpbInVybjpzZXJ2aWNlOmZpbGUuZG93bmxvYWQiXX0.rxoNrjeIN9OYab_rhxq7poeNbIOYVhOhQyci55PZFnQ' />
</div>

