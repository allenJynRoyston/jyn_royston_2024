<script lang='ts'>
  import { page } from '$app/stores';

  import CodeFormat from '$components/CodeFormat.svelte'


  var tag:string = `
    let *is_ready* = !true!
    let *your_mom_is_ready* = !false!
  `

  interface CodeDataSet{
    "text": string,
    "depth": number
  }

  function parseStyleText(tag:string):Array<CodeDataSet> {
    var linesArray:Array<CodeDataSet> = tag.split('\n').map(line => line.trim()).filter(line => line.length > 0).map((text) => {return {text, depth: 0 } } )
    
    var on_depth:number = 0
    linesArray.forEach(object => {
      object.depth = on_depth

      if(object.text.includes("{")){
        on_depth += 1
      }

      if(object.text.includes("}")){
        on_depth -= 1
        object.depth = on_depth 
      }      

    })

    return linesArray    
  }

  function isChangable(str:string):boolean {
    const regex = /\*([^*]+)\*/;
    const match = str.match(regex);
    return match !== null
  }

  function extractPartialString({text}:CodeDataSet):string {
    const regex = /\*([^*]+)\*/;
    const match = text.match(regex);

    const regex2 = /\!([^*]+)\!/;
    const match2 = text.match(regex2);

    var return_str:string = `<span>${text}`

    // this can not happen, but is placed here to satisfy the null condition
    if(match === null || match2 == null){
      return ""
    }

    return_str = return_str.replaceAll(match[0], `<span class='text-red-500'>${match[1]}</span> </span>`)
    return_str = return_str.replaceAll(match2[0], `<span class='text-green-500'>${match2[1]}</span> </span>`)


    return return_str
  }


</script>


<CodeFormat>
  {#each parseStyleText(tag) as item}
    <li class="text-neutral-500 text-xs flex ">
      <span class='w-full' style="padding-left:{(item.depth + 1) * 10}px"  >
        {#if isChangable(item.text)}
          <button type='button' on:click={() => {}}>
            {@html extractPartialString(item)}
          </button>
        {:else}
        <span class='text-inherit'>{item.text}</span>
        {/if}
      </span>
    </li>
  {/each}
</CodeFormat>

