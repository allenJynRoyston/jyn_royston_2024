<script lang='ts'>
  import {onMount} from 'svelte'
  import TablerPrompt from '~icons/humbleicons/prompt'
  import CarbonCloseOutline from '~icons/carbon/close-outline'
  import TablerSquareF1Filled from '~icons/tabler/square-f1-filled';
  import {shouldRedraw} from '$stores/store'

  let is_visible:boolean = false
  let input_content:string = ""

  onMount(() => {
    window.addEventListener('keydown', handleKeydown);

		return () => {
			window.removeEventListener('keydown', handleKeydown)
		}   
  })

  function handleKeydown(event:KeyboardEvent) {
    if (event.key === 'Enter') {
      return
    }

    if (event.key === 'F1') {
      event.preventDefault(); 
      is_visible = !is_visible      
    }
  }

  $: {
    if(is_visible || !is_visible){
      $shouldRedraw = true      
    }
  }  
</script>

<div class='w-full text-xs  text-green-500 bg-neutral-900 transition-all duration-300 ease {is_visible ? 'opacity-100 h-auto px-2 py-5' : 'opacity-0 h-[0px] p-0'}' >
  <div class='flex place-content-between w-full  {is_visible ? 'block' : 'hidden'}'>
    <div class='flex w-[450px] items-center gap-1 border-green-500'>
      <TablerPrompt />
      <input bind:value={input_content} class='text-green-600 focus:border-green-500 focus:outline-none bg-transparent w-full px-1' placeholder="type (help me) for list of commands"/>
    </div>
    <div class='h-full flex-shrink items-center flex'>
      <TablerSquareF1Filled class='text-xl'/>
      <button class='text-lg px-5' on:click={() => {is_visible = false}}>
        <CarbonCloseOutline />
      </button>
    </div>
  </div>
</div>