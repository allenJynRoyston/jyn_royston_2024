<script lang='ts'>
  import { tick } from 'svelte'
  import { page } from '$app/stores';
  import { linkColor, highlightColor, bodyColor } from '$stores/store'

  import CodeFormat from '$components/CodeFormat.svelte'

  export let dataset:Array<Object | any> = []

  var dataset_is_updated:boolean = false
  var render:boolean = true

  linkColor.subscribe(_val => {updateRender()})
  highlightColor.subscribe(_val => {updateRender()})
  bodyColor.subscribe(_val => {updateRender()})

  async function updateRender() {
    render = false
    await tick()
    render = true
  }  

  // ------
  function get_dataset_text(data:any):string {
    return data.stringWithoutTags === null ? "" : data.stringWithoutTags
  }

  // ------
  function is_highlight(data:any):boolean {
    return data.includedClasses.includes("is_highlight")
  }  

  function is_link(data:any):boolean {
    return data.includedClasses.includes("is_link")
  }   

  function is_body(data:any):boolean {
    return data.includedClasses.includes("is_body")
  }     
  
  // ------
  function get_highlight_color(str:string = 'text'):string {
    return `${str}-${$highlightColor.color}-${$highlightColor.weight}`
  }  

  function get_link_color(str:string = 'text'):string {
    return `${str}-${$linkColor.color}-${$linkColor.weight}`
  }

  function get_body_color(str:string = 'text'):string {
    return `${str}-${$bodyColor.color}-${$bodyColor.weight}`
  }


  $: {
    dataset_is_updated = dataset.length > 0
  }


</script>

<CodeFormat>
  {#if dataset_is_updated && render}
    {#each dataset as data, index}
      {#if index > 0}
        <li class="text-neutral-500 text-xs flex ">
          <span class='w-full' style="padding-left:{data.depth * 10}px"  >
            {data.tagName}
            {#if is_link(data)}
              <a aria-current="{$page.url.pathname === '/' ? 'page' : undefined}" href="{data.linkTo}" class="{get_link_color()} underline {is_highlight(data) ? get_highlight_color() : ""}">{get_dataset_text(data)}</a>
            {:else}
              <span class="{is_highlight(data) ? get_highlight_color() : ""} {is_body(data) ? get_body_color() : ""}">{get_dataset_text(data)}</span>
            {/if}
          </span>
        </li>
      {/if}
    {/each}
  {/if}
</CodeFormat>
