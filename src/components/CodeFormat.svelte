<script lang='ts'>
  import {tick} from 'svelte'
  import { bodyFont } from '$stores/store'  

  let lines:Array<number> = new Array(100).fill(0)

  var render:boolean = true

  bodyFont.subscribe(_val => {updateRender()})

  async function updateRender() {
    render = false
    await tick()
    render = true
  }  


</script>

{#if render}
  <div class="absolute h-full w-full overflow-x-hidden overflow-y-auto p-2 text-neutral-500 text-xs flex" style='font-family: {$bodyFont.font}'>
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
      <slot />
    </ul>
  </div>
{/if}


<style lang='postcss'>
  /* Hide scrollbar */
  ::-webkit-scrollbar {
    width: 5px; /* Adjust the width as needed */
  }

  /* Track */
  ::-webkit-scrollbar-track {
    background: black; /* Make the scrollbar track transparent */
  }

  /* Handle */
  ::-webkit-scrollbar-thumb {
    background: grey; /* Set the color of the inner bit to blue */
    border-radius: 10px; /* Round the corners of the scrollbar thumb */
  }

  /* Handle on hover */
  ::-webkit-scrollbar-thumb:hover {
    background: darkblue; /* Change the color of the inner bit on hover */
  }
</style>
