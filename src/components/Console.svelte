<script lang='ts'>
  import {onMount} from 'svelte'
  import TablerPrompt from '~icons/humbleicons/prompt'
  import CarbonCloseOutline from '~icons/carbon/close-outline'
  import TablerSquareF1Filled from '~icons/tabler/square-f1-filled';
  import {saveToLocalStorage, shouldRedraw, disableKeyboardInput, modalState, codeStateDict, consoleUnlockedState, consoleUnlockedStateDict} from '$stores/store'

  let is_visible:boolean = false
  let input_content:string = ""
  let no_such_command:boolean = false

  onMount(() => {
    window.addEventListener('keydown', handleKeydown);

		return () => {
			window.removeEventListener('keydown', handleKeydown)
		}   
  })

  function handleKeydown(event:KeyboardEvent) {
    if( $codeStateDict.enable_console){
      if (event.key === 'Enter' && $disableKeyboardInput) {
        event.preventDefault(); 
        checkForTriggers()
        return
      }

      if ((event.key === 'c' || event.key === 'C') && !$disableKeyboardInput) {
        event.preventDefault(); 
        is_visible = !is_visible      
      }
    }
  }

  function checkForTriggers(){
    switch(input_content){
      // ----------------------------------------------------
      case 'unlock music':
        if(!$consoleUnlockedStateDict.unlocked_music_player){
          $modalState.header = "Unlockable Discovered"
          $modalState.items = [{
            label: "Unlock Music Player",    
            val: true,
            onClick: (val:any) => {
              $consoleUnlockedState[1].state = true
              consoleUnlockedState.update()
              window.alert("Hit 'm' to open the music player.")
            }
          }]
        } else {
          $modalState.header = "Music Player already discovered..."
          $modalState.items = [{
            label: "Okay",    
            val: true,
            onClick: (_val:any) => {}
          }]
        }        
        $modalState.show = true
        return

      // ----------------------------------------------------
      case 'OBLIVION_AWAITS_ALL':
        console.log("here?")   

        $modalState.show = true      
        return
      // ----------------------------------------------------
      case 'AN_EVIL_IS_SEALED_AWAY':
        if(!$consoleUnlockedStateDict.unlocked_hidden_job){
          $modalState.header = "??? Discovered"
          $modalState.items = [{
            label: "I Hear The Call",    
            val: true,
            onClick: (_val:any) => {
              $consoleUnlockedState[2].state = true
              consoleUnlockedState.update()
              window.alert("Something has changed...")
            }
          }]
        } else {
          $modalState.header = "??? already discovered..."
          $modalState.items = [{
            label: "Okay",    
            val: true,
            onClick: (_val:any) => {}
          }]
        }        

        $modalState.show = true      
        return
      // ----------------------------------------------------
      case 'FREE_ME_FROM_HERE':
        if(!$consoleUnlockedStateDict.hidden_local_storage_key){
            $modalState.header = "??? Discovered"
            $modalState.items = [{
              label: "An Ancient Dread Draws Near",   
              val: true,
              onClick: (_val:any) => {
                $consoleUnlockedState[3].state = true
                consoleUnlockedState.update()
                saveToLocalStorage("abyss", "🔑 THE_LOST_RITE_NEEDS_BLOOD")
                window.alert("$x90x8[localStorage]-sd8f7X")
              }
            }]
          } else {
            $modalState.header = "??? already discovered..."
            $modalState.items = [{
              label: "Okay",    
              val: true,
              onClick: (_val:any) => {
                window.alert("$x90x8[localStorage]-sd8f7X")
              }
            }]
          }        

        $modalState.show = true      
        return
      // ----------------------------------------------------
      case 'THE_LOST_RITE_NEEDS_BLOOD':
        if(!$consoleUnlockedStateDict.the_lost_ritual){
            $modalState.header = "??? Discovered"
            $modalState.items = [{
              label: "An Ancient Dread Draws Near",   
              val: true,
              onClick: (val:any) => {
                $consoleUnlockedState[3].state = true
                consoleUnlockedState.update()
                saveToLocalStorage("abyss", "🔑 THE_LOST_RITE_NEEDS_BLOOD")
                window.alert("$x90x8[localStorage]-sd8f7X")
              }
            }]
          } else {
            $modalState.header = "??? already discovered..."
            $modalState.items = [{
              label: "Okay",    
              val: true,
              onClick: (_val:any) => {
                window.alert("$x90x8[localStorage]-sd8f7X")
              }
            }]
          }        

        $modalState.show = true      
        return
        
    }
    
    no_such_command = true
    debounce(() => {
      no_such_command = false
      }, 2000)();
  }

  // Function to debounce the shouldRedraw state update
  function debounce(fn: Function, delay: number) {
    let timer: number;
    return function () {
      clearTimeout(timer);
      timer = setTimeout(fn, delay);
    };
  }

  $: {
    if (is_visible || !is_visible) {
      debounce(() => {
        $shouldRedraw = true;
      }, 300)();
    }

    if(!is_visible){
      $disableKeyboardInput = false
    }
  }
</script>

<div class='w-full text-xs  text-green-500 bg-neutral-900 transition-all duration-300 ease {is_visible ? 'opacity-100 h-auto px-2 py-5 border-t-green-900 border-t-2' : 'opacity-0 h-[0px] p-0'}' >
  <div class='flex place-content-between w-full  {is_visible ? 'block' : 'hidden'}'>
    <div class='flex w-[450px] items-center gap-1 border-green-500'>
      <TablerPrompt font-size={16} />
      $:
      <input bind:value={input_content} on:focus={() => {$disableKeyboardInput = true}} on:blur={() => {$disableKeyboardInput = false}} class='focus:bg-green-800 focus:border-green-500 focus:outline-none text-white bg-transparent w-full p-1 rounded-sm' placeholder="type (help me) for list of commands"/>
      <div class='min-w-[200px]'>
        {#if no_such_command}
          <span >Response: No such command exists.</span>
        {/if}
      </div>
    </div>
    <div class='h-full flex-shrink items-center flex'>
      <button class='text-lg px-5' on:click={() => {is_visible = false}}>
        <CarbonCloseOutline />
      </button>
    </div>
  </div>
</div>