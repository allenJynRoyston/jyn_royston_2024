<script lang='ts'>
  import { tick } from 'svelte'
  import { page } from '$app/stores';
  import { linkColor, highlightColor, imgTagColor, bodyColor, drawerSidebarState, drawerSidebarContent, shouldRedraw, renderIsVisible } from '$stores/store'

  import CodeFormat from '$components/CodeFormat.svelte'
  import Render from '$components/Render.svelte';

  export let dataset:Array<Object | any> = []
  export let container_height:number = 0
  export let is_animating:boolean = false
  export let is_active:boolean = false

  var dataset_is_updated:boolean = false
  var render:boolean = true
  var sidebar_is_busy:boolean = false
  var content_inner_html:string|null = null
 
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

  function has_target_tag(data:any):string {
    return data.target || ""
    
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

  function get_li_color(str:string = 'text'):string {
    return `${str}-${$bodyColor.color}-${$bodyColor.weight}`
  }  

  function get_image_color(str:string = 'text'):string {
    return `${str}-${$imgTagColor.color}-${$imgTagColor.weight}`
  }    

  async function viewImage(src:string){
    
    if(!sidebar_is_busy){
      sidebar_is_busy = true
      setTimeout(() => {
        sidebar_is_busy = false
      }, 300)
      if($drawerSidebarState && src === $drawerSidebarContent){
        onSidebarClose()
        return
      }
      
      $drawerSidebarContent = src
      $drawerSidebarState = true
      $shouldRedraw = true
    }
  }

  function onSidebarClose(){
    $drawerSidebarState = false
    setTimeout(() => {
      $drawerSidebarContent = ""
      $shouldRedraw = true
    }, 50)
  }

  $: {
    dataset_is_updated = dataset.length > 0
    content_inner_html = $renderIsVisible ? document.querySelector('#page-content')?.innerHTML || null : null
  }


</script>

<CodeFormat onSidebarClose={onSidebarClose} trackPosition={true} sidebar_is_open={$drawerSidebarState} sidebar_content={$drawerSidebarContent} {container_height} {is_animating} {is_active}>
  <!-- CONTENT -->
  <div id='html-content' slot='content'>
    {#if dataset_is_updated && render}
      {#each dataset as data, index}
        {#if index > 0}
          <li class="text-neutral-500 text-xs flex ">
            <span class='w-full' style="padding-left:{(data.depth - 4) * 10}px"  >         
              {#if data.tagName !== "br"}
                {data.tagName}
              {/if}

              {#if is_img(data)}
                <button class='{get_image_color()} hover:text-blue-300 transition-colors duration-300' on:click={() => viewImage(data.image.src)}>
                  {data.image.title}
                </button>
              {/if}

              {#if is_link(data)}
                <a aria-current="{$page.url.pathname === '/' ? 'page' : undefined}" href="{data.linkTo}" target={has_target_tag(data)} class="{get_link_color()} underline hover:text-white transition-colors duration-300 {is_highlight(data) ? get_highlight_color() : ""}">{get_dataset_text(data)}</a>
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
      {#if $drawerSidebarContent !== ""}
        <img class='w-full' src={$drawerSidebarContent} alt={$drawerSidebarContent}/>
      {/if}
    </div>
  </div>
</CodeFormat>


<Render show={$renderIsVisible} content={content_inner_html} />