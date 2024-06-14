<script lang='ts'>
  import { onMount } from 'svelte'
  import { codeState, consoleUnlockedState, modalState, consoleUnlockedStateDict } from '$stores/store'
  import CodeFormat from '$components/CodeFormat.svelte'
  import CarbonCloseOutline from '~icons/carbon/close-outline';
  import type { ModalContent } from '$stores/store'

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


  let linesArray:Array<StyleDataSet> = []
  
  let absolutePosition:AbsolutePosition = {
    top: 0,
    left: 0
  }

  let popupItems:ModalContent[] = []
  let showPopup:boolean = false

  onMount(() => {
    parseLines()
  })

  function parseLines(){
    var tag:string = ""

    
    $codeState.forEach(({var_type = 'let', label, state}:any, index) => {
      tag += `${var_type} *${label}* = !${state}! ?set_true_false? \n`
    });    
    
    if($consoleUnlockedStateDict.unlocked_unknown_progress){
      $consoleUnlockedState.forEach(({var_type = 'const', label, state}:any, index) => {
        tag += `const *${state ? label : "[LOCKED]"}* = !${state ? state : '[LOCKED]'}! ?is_const? \n`
      });        
    }

    linesArray = parseStyleText(tag)
  }

  function parseStyleText(tag:string):Array<StyleDataSet> {
    linesArray = tag.split('\n').map(line => line.trim()).filter(line => line.length > 0).map((text) => {return {text, depth: 0, line: 0, trigger: null} } )
   
    var on_depth:number = 0
    linesArray.forEach((object, index) => {
      object.depth = on_depth
      object.line = index 

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
      return text
    }

    // wrap replacable string partials with a span with preavailable tailwind classes
    return_str = return_str.replaceAll(match[0], `<span class='text-blue-200'>${match[1]}</span></span>`)
    return_str = return_str.replaceAll(match2[0], `<span class='text-white'>${match2[1]}</span></span>`)
    return_str = return_str.replaceAll(match3[0], ``)

    return_str = return_str.replace("const", `<span class='text-blue-500'>const</span>`)
    return_str = return_str.replace("let", `<span class='text-blue-500'>let</span>`)

    return return_str
  }


  async function changeProperty(event:Event, {trigger, line}:StyleDataSet){
    const target:EventTarget = event.target as EventTarget
    let dropdownlist:ModalContent[] = []
    
    switch (trigger) {
      // -----------------
      case 'set_true_false': 
        showPopup = true  
        dropdownlist = [
          {
            label: 'true',
            val: true,
          },
          {
            label: 'false',
            val: false
          },          
        ].map(item => ({
          ...item,
          onClick: (val:any) => { 
            $codeState[line].state = val
            codeState.update()
            parseLines()
            showPopup = false 
          }
        }))     

        setupDialogBox(target, line, dropdownlist)
        break
      // -----------------   
      case 'is_const':
        break
    }  
  }

  function setupDialogBox(target:EventTarget, line:number, items:ModalContent[]){
      $modalState.show = true
      $modalState.header = $codeState[line].label
      $modalState.items = items    
  }  

  $: {
    if($consoleUnlockedStateDict.unlocked_unknown_progress || $consoleUnlockedStateDict.unlocked_unknown_progress){
      parseLines()
    }
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
  <div class='absolute text-xs flex gap-3 px-2 py-1 bg-blue-900 rounded-md text-inherit items-center justify-center' style={`top: ${absolutePosition.top}px; left: ${absolutePosition.left}px`}>
    {#each popupItems as item}
      <button type='button' class='text-slate-500 duration-300 hover:text-white transition-color' on:click={() => {item.onClick(item.val)}}>{item.label}</button>
    {/each}
    <button on:click={() => {showPopup = false}}>
      <CarbonCloseOutline class='text-slate-500 duration-300 hover:text-white transition-color' />
    </button>
  </div>
{/if}
