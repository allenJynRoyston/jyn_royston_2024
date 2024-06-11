<script lang='ts'>
  import CarbonCloseOutline from '~icons/carbon/close-outline'
  import OuiSave from '~icons/oui/save';

  export let is_active:boolean = false
  export let is_animating:boolean = false
  export let container_height:number = 0
  export let sidebar_is_open:boolean = false
  export let sidebar_content:string | null = null
  export let onSidebarClose: () => void = () => {}

  function applyInnerClasses(is_expanded:boolean):string{
    return is_expanded ? 'opacity-100 w-full p-2' : 'opacity-50 w-0 p-0'
  }  

</script>

<div class='{sidebar_is_open ? 'flex-grow' : 'flex-shrink'} max-w-[400px] overflow-x-hidden text-neutral-500 text-xs flex bg-gradient-to-r from-slate-900 to-slate-950 {is_active ? 'overflow-y-auto' : 'overflow-y-hidden'}' style='max-height: {is_animating ? '100%' : `${container_height}px`}'>
  <div class='mt-[40px] relative w-full flex flex-col gap-2 {applyInnerClasses(sidebar_is_open)}'>
    {#if sidebar_is_open}
      <div class='flex justify-between border p-2'>
        <a href={sidebar_content} target="_blank" class='hover:text-white transition-colors duration-300 text-nowrap truncate pr-4'>{sidebar_content}</a>
        <div class='flex gap-2 '>
          <!-- <a class='hover:text-white transition-colors duration-300' href={sidebar_content} target="_blank" download> <OuiSave /> </a> -->
          <button class='hover:text-white transition-colors duration-300' on:click={onSidebarClose}> <CarbonCloseOutline /> </button>
        </div>
      </div>


      <div class='flex-grow'>
        <slot />
      </div>


      <button class='border p-2 hover:text-white transition-colors duration-300 flex gap-1 justify-center' on:click={onSidebarClose}>Close <CarbonCloseOutline /> </button>
    {/if}
  </div>         
</div>    