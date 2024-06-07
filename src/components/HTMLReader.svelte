<script lang='ts'>
  import { page } from '$app/stores';

  export let dataset:Array<Object | Any> = []

  let lines:Array<number> = new Array(100).fill(0)
  var dataset_is_updated:boolean = false
  
  function get_dataset_tag(index:number):String {
    return index in dataset ? dataset[index].tagName : ""
  }

  function get_dataset_text(index:number):String {
    return index in dataset ? `${dataset[index].stringWithoutTags === null ? "" : dataset[index].stringWithoutTags}` : ""
  }

  function get_dataset_depth(index:number):number {
    return index in dataset ? (dataset[index].depth) * 10 : 0
  }

  function is_green(index:number):boolean {
    return index in dataset ? dataset[index].includedClasses.includes("is_green") : false
  }  

  function is_link(index:number):boolean {
    return index in dataset ? dataset[index].includedClasses.includes("is_link") : false
  }   

  function is_text(index:number):boolean {
    return index in dataset ? dataset[index].includedClasses.includes("is_text") : false
  }     
  
  function get_link(index:number):String {
    return index in dataset ? dataset[index].linkTo : null
  }     

  $: {
    dataset_is_updated = dataset.length > 0
  }

</script>


<div id="html-reader" class="absolute h-full w-full overflow-x-hidden overflow-y-auto p-2">
  <ul class='flex flex-col gap-0'>
    {#if dataset_is_updated}
      {#each lines as _item, index}
        {#if index > 0}
          <li class="text-zinc-500 text-xs flex">
            <span class='min-w-10 text-zinc-400 border-zinc-700 border-r'>
              {index}
            </span>
            <span class='w-full' style="padding-left:{get_dataset_depth(index)}px"  >
              {get_dataset_tag(index)}
              {#if is_link(index)}
                <a aria-current="{$page.url.pathname === '/' ? 'page' : undefined}" href="{get_link(index)}" class="text-blue-500 underline {is_green(index) ? "text-green-500" : ""}">{get_dataset_text(index)}</a>
              {:else}
                <span class="{is_link(index) ? "text-blue-500" : ""} {is_green(index) ? "text-green-500" : ""} {is_text(index) ? "text-white" : ""}">{get_dataset_text(index)}</span>
              {/if}
            </span>
          </li>
        {/if}
      {/each}
    {/if}
  </ul>      
</div>



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
