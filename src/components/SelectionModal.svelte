<script lang='ts'>
  import {onMount} from 'svelte'
  import {modalState, shouldRedraw} from '$stores/store'
  import { tweened  } from 'svelte/motion';
  import type { Tweened } from 'svelte/motion';
  import PopupFrame from '$components/PopupFrame.svelte'
  import CarbonCloseOutline from '~icons/carbon/close-outline';

  let is_animating:boolean = false
  let opacity: Tweened<number>

  onMount(() => {
    window.addEventListener('keydown', handleKeydown);

		return () => {
			window.removeEventListener('keydown', handleKeydown)
		}   
  })

  function handleKeydown(event:KeyboardEvent) {
    if (event.key === 'Delete' && $modalState.show && !is_animating) {
      $modalState.show = false
      $shouldRedraw = true
    }
  }

  function onAnimationComplete(){
    is_animating = false
  }


  $:{
    if($modalState.show){
      is_animating = true
      opacity = tweened (0.5, { duration: 300 });
      opacity.set(0.9)
    }
    else{
      opacity = tweened (0, { duration: 0 });
      opacity.set(0)
    }
  }


</script>


<dialog open={$modalState.show} class='fixed z-50 top-0 left-0 w-full h-full bg-slate-800' style="opacity: {$opacity}">

  <PopupFrame show={$modalState.show} {onAnimationComplete}>
    <div class='flex flex-col gap-2'>
      {#if $modalState?.header}
        <p class='text-sm text-center'>{$modalState.header}</p>
      {/if}
      <div class='flex flex-col gap-1'>
        {#if $modalState?.items}
          {#each $modalState.items as item}
            <button class='bg-slate-500 hover:bg-slate-700 text-white p-2 text-xs min-w-20' on:click={() => {item.onClick(item.val); $modalState.show = false }}>{item.label}</button>
          {/each}
        {/if}
      </div>
    </div>
  </PopupFrame>

  <div class="absolute top-0 right-2 flex items-center justify-center z-50">
    <button class='text-xl p-5 ease duration-300 text-white hover:text-red-600 transition-color' on:click={() => {$modalState.show = false}}>
      <CarbonCloseOutline />
    </button>
  </div>



</dialog>