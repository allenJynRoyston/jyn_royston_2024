<script lang='ts'>
  import { page } from '$app/stores';
  import { onMount, tick } from 'svelte'
  import { linkColor, highlightColor, bodyColor, bodyFont, imgTagColor } from '$stores/store'
  import CodeFormat from '$components/CodeFormat.svelte'

  export let container_height:number = 0
  export let is_animating:boolean = false
  export let is_active:boolean = false

  var sidebar_is_open:boolean = false

  interface StyleDataSet{
    text: string,
    trigger:string | null,
    line:number, 
    depth: number
  }

  interface AbsolutePosition{
    top: number,
    left: number
  }

  interface DialogList{
    label: string,
    val: any,
    onClick: (val: any) => void
  }

  let linesArray:Array<StyleDataSet> = []
  
  let absolutePosition:AbsolutePosition = {
    top: 0,
    left: 0
  }

  let popupItems:Array<DialogList> = []
  let showPopup:boolean = false

  onMount(() => {
    parseLines()
  })

  function parseLines(){
    var tag:string = `
      html{
        *font-family*: !${$bodyFont.font}!;             ?body_font?
      }

      a .link{
        *color*: !${$linkColor.color}!,                 ?link_color?
        *font-weight*: !${$linkColor.weight}!;          ?link_weight?
      }

      body{
        *color*: !${$bodyColor.color}!,                ?body_color?
        *font-weight*: !${$bodyColor.weight}!;         ?body_weight?
      }

      .important{
        *color*: !${$highlightColor.color}!,           ?highlight_color?
        *font-weight*: !${$highlightColor.weight}!;    ?highlight_weight?
      }

      img button{
        *color*: !${$imgTagColor.color}!,                 ?img_color?
        *font-weight*: !${$imgTagColor.weight}!;          ?img_color?
      }      

    `    
    linesArray = parseStyleText(tag)
  }

  function parseStyleText(tag:string):Array<StyleDataSet> {
    linesArray = tag.split('\n').map(line => line.trim()).filter(line => line.length > 0).map((text) => {return {text, depth: 0, line: 0, trigger: null} } )
    
    var on_depth:number = 0
    linesArray.forEach((object, index) => {
      object.depth = on_depth
      object.line = index

      if(object.text.includes("{")){
        on_depth += 1
      }

      if(object.text.includes("}")){
        on_depth -= 1
        object.depth = on_depth 
      }      

      // grabs trigger word
      const regex = /\?([^*]+)\?/;
      const match = object.text.match(regex);   
      if(match !== null){
        object.trigger = match[1]
      }

    })

    return linesArray    
  }

  function isChangable(str:string):boolean {
    const regex = /\*([^*]+)\*/;
    const match = str.match(regex);
    return match !== null
  }

  function extractPartialString({text}:StyleDataSet):string {
    const regex = /\*([^*]+)\*/;
    const match = text.match(regex);

    const regex2 = /\!([^*]+)\!/;
    const match2 = text.match(regex2);

    const regex3 = /\?([^*]+)\?/;
    const match3 = text.match(regex3);    

    var return_str:string = `<span>${text}`

    // this can not happen, but is placed here to satisfy the null condition
    if(match === null || match2 == null|| match3 == null){
      return ""
    }

    // wrap replacable string partials with a span with preavailable tailwind classes
    return_str = return_str.replaceAll(match[0], `<span class='text-blue-200'>${match[1]}</span></span>`)
    return_str = return_str.replaceAll(match2[0], `<span class='text-white'>${match2[1]}</span></span>`)
    return_str = return_str.replaceAll(match3[0], ``)

    return return_str
  }


  async function changeProperty(event:Event, {trigger, line}:StyleDataSet){
    const target:EventTarget = event.target as EventTarget
    let dropdownlist:Array<DialogList> = []
    showPopup = true  

    function update_color(color:string, prop:any, propvar:any){
        prop.update({color, weight: propvar.weight})      
        parseLines()
        showPopup = false
      }

    function update_weight(weight:string, prop:any, propvar:any){
      prop.update({color: propvar.color, weight:Number(weight)})      
      parseLines()
      showPopup = false
    }    

    function update_bodyfont(font:string){
      bodyFont.update({font})
      parseLines()
      showPopup = false
    }   

    // blue|green|red|purple|neutral|slate|orange

    function colorOptions(prop:any, propvar:any){
      let dropdownlist:Array<DialogList> = [
          {
            label: "neutral",
          },            
          {
            label: "slate",
          },            
          {
            label: "green",
          },        
          {
            label: "red",
          },
          {
            label: "purple",
          },      
          {
            label: "orange",
          },
          {
            label: "blue",
          },                                       
      ].map(item => ({
        ...item,
        val: item.label,
        onClick: (val:any) => { update_color(val, prop, propvar) }
      }))
      
      setupDialogBox(target, line, dropdownlist)    
    }    


    function weightOptions(prop:any, propvar:any){
      let dropdownlist:Array<DialogList> = [50,100,200,300,400,500,600,700].map(item => ({
        label: String(item),
        val: item,
        onClick: (val:any) => { update_weight(val, prop, propvar) }
      }))
      setupDialogBox(target, line, dropdownlist)    
    }        

    switch (trigger) {
      // -----------------
      case 'body_font': 
        dropdownlist = [
          {
            label: `Roboto`,
            val: '`"Roboto", sans-serif`',
          },
          {
            label: `Ubuntu`,
            val: `"Ubuntu Mono", monospace`,
          },          
        ].map(item => ({
          ...item,
          onClick: (val:any) => { update_bodyfont(val) }
        }))     

        setupDialogBox(target, line, dropdownlist)
        break
      // -----------------
      case 'link_color':
        colorOptions(linkColor, $linkColor)
        break
      // -----------------
      case 'body_color':
        colorOptions(bodyColor, $bodyColor)
        break        
      // -----------------
      case 'img_color':
        colorOptions(imgTagColor, $imgTagColor)
        break        
      // -----------------
      case 'highlight_color':
        colorOptions(highlightColor, $highlightColor)
        break        
      // -----------------
      case 'link_weight':
        weightOptions(linkColor, $linkColor)
        break   
      // -----------------
      case 'img_weight':
        weightOptions(imgTagColor, $imgTagColor)
        break               
      // -----------------
      case 'highlight_weight':
        weightOptions(highlightColor, $highlightColor)
        break
      // -----------------
      case 'body_weight':
        weightOptions(bodyColor, $bodyColor)
        break
      // -----------------      
    }  
  }


  function setupDialogBox(target:EventTarget, line:number, _popupItems:Array<DialogList>){
      const element = target as HTMLElement
      const parentElement = element.parentNode as HTMLElement;
      const rect = element.getBoundingClientRect()
      absolutePosition = { 
        top: line * parentElement.getBoundingClientRect().height,
        left: rect.left 
      }
      popupItems = _popupItems
  }  

</script>

<CodeFormat {sidebar_is_open} {container_height} {is_animating} {is_active}>
  <!-- CONTENT -->
  <div slot='content'>
    {#each linesArray as item}
      <li class="text-neutral-500 text-xs flex ">
        <span class='w-full' style="padding-left:{(item.depth + 1) * 10}px"  >
          {#if isChangable(item.text)}
            <button type='button' on:click={(event) => changeProperty(event, item)}>
              {@html extractPartialString(item)}
            </button>
          {:else}
          <span class='text-inherit'>{item.text}</span>
          {/if}
        </span>
      </li>
    {/each}
  </div>
  <!-- SIDEBAR -->
  <div slot='sidebar'>
    <p>Sidebar content!</p>
  </div>  
</CodeFormat>

{#if showPopup}
  <div class='absolute text-xs flex gap-3 px-2 py-1 bg-blue-900 rounded-md text-inherit' style={`top: ${absolutePosition.top}px; left: ${absolutePosition.left}px`}>
    {#each popupItems as item}
      <button type='button' class='text-slate-500 hover:text-white transition-color' on:click={() => {item.onClick(item.val)}}>{item.label}</button>
    {/each}
  </div>
{/if}
