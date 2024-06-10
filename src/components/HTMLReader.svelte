<script lang='ts'>
  import { tick } from 'svelte'
  import { page } from '$app/stores';
  import { linkColor, highlightColor, imgTagColor, bodyColor, drawerSidebarState } from '$stores/store'

  import CodeFormat from '$components/CodeFormat.svelte'

  export let dataset:Array<Object | any> = []
  export let container_height:number = 0
  export let is_animating:boolean = false
  export let is_active:boolean = false

  var dataset_is_updated:boolean = false
  var render:boolean = true
  var sidebar_is_open:boolean = false
  var sidebar_content:string | null = null


  linkColor.subscribe(_val => {updateRender()})
  highlightColor.subscribe(_val => {updateRender()})
  bodyColor.subscribe(_val => {updateRender()})
  imgTagColor.subscribe(_val => {updateRender()})

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

  function is_img(data:any):boolean {    
    return data.image !== null
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

  function get_image_color(str:string = 'text'):string {
    return `${str}-${$imgTagColor.color}-${$imgTagColor.weight}`
  }    

  function viewImage(src:string){
    if(sidebar_is_open && src === sidebar_content){
      onSidebarClose()
      return
    }
    sidebar_is_open = true
    sidebar_content = src
    $drawerSidebarState = true
  }

  function onSidebarClose(){
    sidebar_is_open = false
    setTimeout(() => {
      sidebar_content = null
      $drawerSidebarState = false
    }, 1000)
  }

  $: {
    dataset_is_updated = dataset.length > 0
  }


</script>

<CodeFormat onSidebarClose={onSidebarClose} {sidebar_is_open} {sidebar_content} {container_height} {is_animating} {is_active}>
  <!-- CONTENT -->
  <div slot='content'>
    {#if dataset_is_updated && render}
      {#each dataset as data, index}
        {#if index > 0}
          <li class="text-neutral-500 text-xs flex ">
            <span class='w-full' style="padding-left:{data.depth * 10}px"  >         
              {data.tagName}   

              {#if is_img(data)}
                <button class='{get_image_color()} hover:text-blue-300 transition-colors duration-300' on:click={() => viewImage(data.image.src)}>
                  {data.image.title}
                </button>
              {/if}

              {#if is_link(data)}
                <a aria-current="{$page.url.pathname === '/' ? 'page' : undefined}" href="{data.linkTo}" class="{get_link_color()} underline hover:text-white transition-colors duration-300 {is_highlight(data) ? get_highlight_color() : ""}">{get_dataset_text(data)}</a>
              {:else}
                <span class="{is_highlight(data) ? get_highlight_color() : ""} {is_body(data) ? get_body_color() : ""}">{get_dataset_text(data)}</span>
              {/if}

            </span>
          </li>
        {/if}
      {/each}
    {/if}
  </div>
  <!-- SIDEBAR -->
  <div slot='sidebar'>
    <div class='flex'>
      {#if sidebar_content !== null}
        <img class='w-full' src={sidebar_content} alt={sidebar_content}/>
      {/if}
    </div>
  </div>
</CodeFormat>
