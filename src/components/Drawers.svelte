<script lang='ts'>
	import {onMount, tick} from 'svelte'
  import {drawerState} from '$stores/store'
  import { page } from '$app/stores';

	import HTMLReader from '$components/HTMLReader.svelte';
  import CodeReader from '$components/CodeReader.svelte';
  import StyleReader from '$components/StyleReader.svelte';

	const section_classes:string = "relative p-0 transition-all duration-500 ease"
  const button_classes:string = "absolute text-xs top-2 right-6 px-4 py-2 w-20 bg-blue-500 hover:bg-blue-700 text-white rounded-none"

	// let flex_states:Array<boolean> = $drawerState;
	let min_heights:Array<number> = [0, 0, 0]
	let isAnimating:boolean = false;
	let content_list:Array<Object> = []
	let previous_route:String
	let is_mounted:boolean = false
	let is_rendred:boolean = true

	// get and set min_heights when component is ready
	onMount(() => {
		setMinHeight()
		setHtmlContent()
		is_mounted = true
	})



	// toggle function
	function toggleFlex(index: number) {  
    if(!isAnimating)  
      isAnimating = true;
      var new_state:Array<boolean> = $drawerState.map((state, i) => {return i == index ? !state : state})
      drawerState.update(new_state)
     
      setTimeout(() => {
        isAnimating = false;
				setMinHeight()
      }, 500)
	}

	// evaluates all the children/sections and gets their current height 
	// and assigns it to the array.  Keeps the transitions smooth
	function setMinHeight() {
		for(let i = 1; i < document.querySelectorAll('#component-container > section').length + 1; i++ ){
			const nthSection:Element | null = document.querySelector(`section:nth-child(${i})`);
			const is_expanded:boolean = nthSection?.classList.contains("flex-1") || false
			min_heights[i - 1] = is_expanded ? 0 : Number(nthSection?.clientHeight || 0)
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

	function traverse(list:Array<Object>, element:Element | null):Array<Object> {
		if(element){
        // Get the tag name of the element
        const tagName:String = element.tagName.toLowerCase();
				const innerHTML = element.innerHTML
				const classList = element.classList
				const includedClasses:Array<String> = [];
				const stringWithoutTags = innerHTML.replace(/<[^>]+>.*?<\/[^>]+>/g, '').replace(/<\/[^>]+>/g, '')
				const linkTo:String | null = element.hasAttribute("href") ? element.getAttribute("href") : null
				
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
					linkTo,
					stringWithoutTags: stringWithoutTags === "" ? null : stringWithoutTags
				})
				
        // Recursively traverse the child elements
        for (let i = 0; i < element.children.length; i++) {
            traverse(list, element.children[i])
        }

				return list
    }

		return []
	}

	$:{
		if(previous_route !== $page.route.id && is_mounted){
			previous_route = String($page.route.id)
			setHtmlContent()
		}
	}

</script>



{#if is_mounted}
  <section class="{section_classes} {$drawerState[0] ? 'flex-1 bg-slate-900' : 'flex-0 bg-slate-700'}" style="min-height:{min_heights[0]}px">
    <div class="transition-all p-0 {$drawerState[0] ? 'opacity-100 h-full w-full' : 'opacity-50 h-14'}">
      {#if is_rendred}
        <HTMLReader dataset={content_list} />
      {/if}
    </div>
    <a href='#html'>
      <button class={button_classes} on:click="{() => toggleFlex(0)}">
        HTML
      </button>
    </a>
  </section>

  <section class="{section_classes} {$drawerState[1] ? 'flex-1 bg-slate-900' : 'flex-0 bg-slate-700'}" style="min-height:{min_heights[1]}px">
    <div class="transition-all p-0 {$drawerState[1] ? 'opacity-100 h-auto' : 'opacity-0 h-14'}">
      {#if is_rendred}
        <CodeReader />
      {/if}
    </div>
    <a href='#code'>
      <button class={button_classes} on:click="{() => toggleFlex(1)}">
        JS
      </button>
    </a>
  </section>

  <section class="{section_classes} {$drawerState[2] ? 'flex-1 bg-slate-900' : 'flex-0 bg-slate-700'}" style="min-height:{min_heights[2]}px">
    <div class="transition-all {$drawerState[2] ? 'opacity-100 h-auto' : 'opacity-0 h-14 overflow-hidden'}">
      <StyleReader />
    </div>
    <a href='#style'>
      <button class={button_classes} on:click="{() => toggleFlex(2)}">
        CSS
      </button>
    </a>
  </section>
{/if}