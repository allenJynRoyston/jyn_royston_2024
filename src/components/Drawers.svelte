<script lang='ts'>
	import {onMount, tick} from 'svelte'
  import {drawerState, shouldRedraw, shouldReparse, renderIsVisible, codeStateDict} from '$stores/store'
  import { page } from '$app/stores';

	import HTMLReader from '$components/HTMLReader.svelte';
  import CodeReader from '$components/CodeReader.svelte';
  import StyleReader from '$components/StyleReader.svelte';

	const section_classes:string = "drawer overflow-y-hidden relative min-h-[50px] transition-all duration-500 ease"
  const button_container_classes:string = "absolute text-xs top-2 right-6"
  const button_classes:string = "px-4 py-2 w-[100px] bg-blue-500 hover:bg-blue-700 text-white rounded-none ml-1"

	// let flex_states:Array<boolean> = $drawerState;
	let section_heights:Array<number> = [0, 0, 0]	
	let content_list:Array<Object> = []
	let previous_route:String
	let is_mounted:boolean = false
	let is_rendred:boolean = true
  let is_animating:boolean = false;
  let timeoutId:any;

  type ListItem = {
    tagName: string 
		includedClasses: Array<string>
		depth: number
		linkTo: string | null
		stringWithoutTags: string | null
    target: string | null,
    image: {
      title: string | null
      src: string | null
    } | null
  }


	// get and set min_heights when component is ready
	onMount(() => {    
    is_mounted = true
    setHtmlContent()

    setTimeout(() => {
		  setMinHeight()    
    }, 1)


    window.addEventListener('resize', handleResize)

		return () => {
			window.removeEventListener('resize', handleResize)
		}    
	})
  
  function handleResize() {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
			setMinHeight()      
    }, 500); 
  }

	// toggle function
	function toggleFlex(index: number) {  
    if(!is_animating)  
      is_animating = true;
      $drawerState = $drawerState.map((state, i) => {return i == index ? !state : state})
      drawerState.update()
     
      setTimeout(() => {
        is_animating = false;
				setMinHeight()
      }, 500)
	}

	// evaluates all the children/sections and gets their current height 
	// and assigns it to the array.  Keeps the transitions smooth
	function setMinHeight() {    
		for(let i = 1; i < document.querySelectorAll('.drawer').length + 1; i++ ){
		  const nthSection:Element | null = document.querySelector(`section:nth-child(${i})`);
      section_heights[i - 1] = nthSection?.getBoundingClientRect().height || 0
		}
	}

	async function setHtmlContent() {
		is_rendred = false
		await tick();
    content_list = traverse([], document.querySelector('#hidden-content')) 		
    is_rendred = true
	}

	function calculateDepth(element:Element) {
    let depth = 0;
    let parent = element.parentElement;

    // Traverse up the DOM tree until reaching the parent div with ID #component-container
    while (parent && parent.id !== 'component-container') {
        depth++;
        parent = parent.parentElement;
    }

    return depth;
  }
  

	function traverse(list:Array<ListItem>, element:Element | null):Array<ListItem> {
		if(element){
        // Get the tag name of the element
        const tagName:string = element.tagName.toLowerCase();
				const innerHTML = element.innerHTML
				const classList = element.classList
				const includedClasses:Array<string> = [];        
				const stringWithoutTags = innerHTML.replace(/<[^>]+>.*?<\/[^>]+>/g, '').replace(/<\/[^>]+>/g, '').replace(/<.*$/, '').trim()
				const linkTo:string | null = element.hasAttribute("href") ? element.getAttribute("href") : null
        const imageSrc:string | null = element.hasAttribute("src") ? element.getAttribute("src") : null
				const imageTitle:string | null = element.hasAttribute("data-src-title") ? element.getAttribute("data-src-title") : null
        const target:string | null = element.hasAttribute("target") ? element.getAttribute("target") : null
        const hasImage:boolean = imageSrc !== null && imageTitle !== null


				// first, filters out any svelte-specific classes
				classList.forEach(cn => {
					// Check if the class contains the partial string
					if (!cn.includes('s-y_')) {
							// Add the class to the filtered array
							includedClasses.push(cn)
					}
				});	
				
				// add to list
				list.push({
					tagName, 
					includedClasses, 
					depth: calculateDepth(element),
          target,
					linkTo,
					stringWithoutTags: stringWithoutTags === "" ? null : stringWithoutTags,
          image: hasImage ? {
            title: imageTitle,
            src: imageSrc,
          } : null
				})
				
        // Recursively traverse the child elements
        for (let i = 0; i < element.children.length; i++) {
            traverse(list, element.children[i])
        }

				return list
    }

		return []
	}

  function applyExpandClasses(is_expanded:boolean):string{
    return is_expanded ? "flex-grow bg-slate-900" : "flex-shrink bg-slate-700"
  }

  function applyInnerClasses(is_expanded:boolean):string{
    return is_expanded ? 'opacity-100 h-1' : 'opacity-20 h-14'
  }


	$:{
    if(is_mounted){
      if(previous_route !== $page.route.id){
        previous_route = String($page.route.id)
        window.location.hash = '';
        setHtmlContent()
      }

      if(!$shouldRedraw && is_mounted){
        handleResize()
      }    

      if($shouldReparse){      
        setHtmlContent()
      }    
    }
  
 
	}

</script>



{#if is_mounted}
  <div class='flex flex-col w-full h-full gap-1 bg-slate-800'>
    <section class='{section_classes} {applyExpandClasses($drawerState[0])}'>
      <div class="transition-all p-0 {applyInnerClasses($drawerState[0])}">
        {#if is_rendred}
          <HTMLReader dataset={content_list} container_height={section_heights[0]} {is_animating} is_active={$drawerState[0]}/>
        {/if}
      </div>
      <div class={button_container_classes}>
        <div class='flex'>
          {#if $codeStateDict?.enable_render_mode || false}
            <a href='#render'>
              <button class='{button_classes} bg-red-600 hover:bg-red-800 disabled:opacity-20' disabled={!$drawerState[0]} on:click={() => {$renderIsVisible = true}}>
                RENDER
              </button>
            </a>
            {/if}
                  
          <button class={button_classes} on:click="{() => toggleFlex(0)}">
            HTML
          </button>
        </div>
      </div>    
    </section>
    <section class='{section_classes} {applyExpandClasses($drawerState[1])}'>
      <div class="transition-all p-0 {applyInnerClasses($drawerState[1])}">
        <StyleReader container_height={section_heights[1]} {is_animating} is_active={$drawerState[1]} />
      </div>
      <div class={button_container_classes}>
        <div class='flex'>
          <button class={button_classes} on:click="{() => toggleFlex(1)}">
            CSS
          </button>
        </div>    
      </div>
    </section>  
    <section class='{section_classes} {applyExpandClasses($drawerState[2])}'>
      <div class="transition-all p-0 {applyInnerClasses($drawerState[2])}">
        <CodeReader container_height={section_heights[2]} {is_animating} is_active={$drawerState[2]} />
      </div>
      <div class={button_container_classes}>
        <div class='flex'>
          <button class={button_classes} on:click="{() => toggleFlex(2)}">
            JS
          </button>
        </div>
      </div>      
    </section> 
  </div>
{/if}