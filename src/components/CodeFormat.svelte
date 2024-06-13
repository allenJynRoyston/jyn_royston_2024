<script lang='ts'>
  import Sidebar from '$components/Sidebar.svelte';

  export let sidebar_is_open:boolean = false
  export let container_height:number = 0
  export let is_animating:boolean = false
  export let is_active:boolean = false
  export let sidebar_content:string | null = null
  export let onSidebarClose: () => void = () => {}

  let lines:Array<number> = new Array(100).fill(0)
  

</script>



<div class='flex' >
  <div class="h-full flex-grow  p-2 py-5 text-neutral-500 text-xs flex overflow-x-hidden {is_active ? 'overflow-y-auto' : 'overflow-y-hidden'}" style='max-height: {is_animating ? '100%' : `${container_height}px`}'>
    <ul class='flex flex-col gap-0'>
        {#each lines as _item, index}
          {#if index > 0}
            <li class="text-neutral-500 text-xs flex ">
              <span class='min-w-10  border-neutral-700 border-r'>
                {index}
              </span>
            </li>
          {/if}
        {/each}
    </ul>      
    <ul class='flex flex-col w-full gap-0'>
      <slot name="content" />
    </ul>
  </div>
  

  <!-- sidebar  -->
  <Sidebar {container_height} {sidebar_is_open} {is_animating} {is_active} {sidebar_content} {onSidebarClose} >
    <slot name='sidebar' />
  </Sidebar>
</div>


<style lang='postcss'>
  @tailwind base;

  /* Hide scrollbar */
  ::-webkit-scrollbar {
    width: 10px; /* Adjust the width as needed */
  }

  /* Track */
  ::-webkit-scrollbar-track {
      @apply bg-slate-950; /* Make the scrollbar track transparent */
  }

  /* Handle */
  ::-webkit-scrollbar-thumb {
      @apply bg-slate-700; /* Set the color of the inner bit to grey and round the corners */
  }

  /* Handle on hover */
  ::-webkit-scrollbar-thumb:hover {
      @apply bg-green-500; /* Change the color of the inner bit on hover */
  }
</style>
