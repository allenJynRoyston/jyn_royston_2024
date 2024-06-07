<script lang='ts'>
  import { page } from '$app/stores';

  let lines:Array<number> = new Array(100).fill(0)
  // var dataset_is_updated:boolean = false
  
  // function get_dataset_tag(index:number):String {
  //   return index in dataset ? dataset[index].tagName : ""
  // }

  // function get_dataset_text(index:number):String {
  //   return index in dataset ? `${dataset[index].stringWithoutTags === null ? "" : dataset[index].stringWithoutTags}` : ""
  // }

  // function get_dataset_depth(index:number):number {
  //   return index in dataset ? (dataset[index].depth + 1) * 10 : 5
  // }

  // function is_green(index:number):boolean {
  //   return index in dataset ? dataset[index].includedClasses.includes("is_green") : false
  // }  

  // function is_link(index:number):boolean {
  //   return index in dataset ? dataset[index].includedClasses.includes("is_link") : false
  // }   

  // function is_text(index:number):boolean {
  //   return index in dataset ? dataset[index].includedClasses.includes("is_text") : false
  // }     
  
  // function get_link(index:number):String {
  //   return index in dataset ? dataset[index].linkTo : null
  // }     

  // $: {
  //   dataset_is_updated = dataset.length > 0
  // }

</script>

<div id="code-reader" class="absolute h-full w-full overflow-x-hidden overflow-y-auto p-2">
  <ul class='flex flex-col gap-0'>
      {#each lines as _item, index}
        {#if index > 0}
          <li class="text-zinc-500 text-xs flex">
            <span class='min-w-10 text-zinc-400 border-zinc-700 border-r'>
              {index}
            </span>
          </li>
        {/if}
      {/each}
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
