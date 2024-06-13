<script lang='ts'>
  import {onMount, tick} from 'svelte'
  import {shouldRedraw} from '$stores/store'
  import IcBaselinePlayCircle from '~icons/ic/baseline-play-circle';
  import CarbonPauseOutline from '~icons/carbon/pause-outline';
  import CarbonCloseOutline from '~icons/carbon/close-outline';
  import TablerSquareF2Filled from '~icons/tabler/square-f2-filled';
  import IcomoonFreeNext from '~icons/icomoon-free/next';
  import IcomoonFreePrevious from '~icons/icomoon-free/previous';  
  import IconParkOutlineLoadingThree from '~icons/icon-park-outline/loading-three';

  type SoundCloudTrack = {
    id: number;
    title: string;
    permalink_url: string;
    user: {
      id: number;
      username: string;
      permalink_url: string;
    };
    duration: number;
    artwork_url: string | null;
    stream_url: string;
  }

  let script_loaded:boolean = false
  let render_sc_player:boolean = true
  let is_visible:boolean = false
  let is_playing:boolean = false
  let currentTrack:SoundCloudTrack | null = null

  let jukebox_list:Array<string> = [
    '842651413',
    '1555483228',
    '842651362',   
    '842651308', 
    '1555482853',
  ]

  let jukebox_index:number = 0
  
  onMount(() => {    

    window.addEventListener('keydown', handleKeydown);
		return () => {
			window.removeEventListener('keydown', handleKeydown)
		}   
  })

  async function loadSC(){
    try{
      await loadScript('https://w.soundcloud.com/player/api.js')
      setupSC()
      script_loaded = true
      console.log("SC loaded correctly.")
    }
    catch(err){
      console.error("Error loading correctly.")
    }
  }

  // Function to load the script dynamically
  function loadScript(url:string) {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = url;
      script.onload = resolve;
      script.onerror = reject;
      document.body.appendChild(script);
    });
  }  

  function setupSC(){
    if(is_visible){
      // Get a reference to the SoundCloud iframe
      const soundcloudIframe = document.getElementById('soundcloud-iframe');

      // Initialize the SoundCloud Player SDK
      const player = SC.Widget(soundcloudIframe);
      // Add event listeners to listen for player events
      player.bind(SC.Widget.Events.PLAY, function() {
        is_playing = true
      });

      player.bind(SC.Widget.Events.PAUSE, function() {
        is_playing = false
      });

      player.bind(SC.Widget.Events.READY, function() {
        player.getCurrentSound(function(_currentTrack:SoundCloudTrack) {
          currentTrack = _currentTrack
          $shouldRedraw = true  
        });
      });      
    }
  }

  function handleKeydown(event:KeyboardEvent) {
    if (event.key === 'F2') {
      event.preventDefault(); // Prevent the default browser action (e.g., saving the page)
      is_visible = !is_visible
    }
  }  

  async function playNext(){
    jukebox_index++
    if(jukebox_index > jukebox_list.length - 1){
      jukebox_index = 0
    }
    rerenderSC()
  }

  async function playPrev(){
    jukebox_index--
    if(jukebox_index < 0){
      jukebox_index = jukebox_list.length - 1
    }
    rerenderSC()
  }

  async function rerenderSC(){
    if(!script_loaded){
      await loadSC()
    }
    is_playing = false
    currentTrack = null
    render_sc_player = false
    await tick()
    render_sc_player = true    
    await tick()
    setupSC()    
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
      if(is_visible){
        rerenderSC()
      }
      else{
        debounce(() => {
          $shouldRedraw = true
        }, 300)();
      }
    }
  }
</script>


<div class='w-full text-xs text-green-500 bg-neutral-900 transition-all duration-300 ease overflow-hidden {is_visible ? 'opacity-100 h-[auto] px-2 py-5 border-t-green-900 border-t-2' : 'opacity-0 h-[0px] p-0'}' >
  <div class='flex relative place-content-between w-full h-[65px]  {is_visible ? 'block' : 'hidden'}'>
    <div class='absolute top-0 left-20 pr-20 p-2 w-full h-full flex place-content-between'>
      <div class='flex-shrink flex gap-10'>
        <div class='items-center flex gap-5'>
          <button on:click={playPrev} disabled={currentTrack === null} class='disabled:opacity-50'>
            <IcomoonFreePrevious font-size={32}/>
            prev
          </button>
          <button on:click={playNext} disabled={currentTrack === null} class='disabled:opacity-50'>            
            <IcomoonFreeNext font-size={32}/>
            next
          </button>          
        </div>        
        <div class='h-full  flex flex-col items-center justify-center border min-w-[300px] border-green-400'>
          {#if currentTrack === null}
            <IconParkOutlineLoadingThree font-size={24} class='animate-spin' />
          {:else}  
            <a href={currentTrack.permalink_url}>{currentTrack.title} </a>
            <span class:marquee={is_playing}  >
              <p class='slow'>{`track by ${currentTrack.user.username}`}</p>                 
            </span>
          {/if}
        </div>

      </div>
      <div class='h-full flex-shrink items-center flex'>
        <TablerSquareF2Filled class='text-xl'/>
        <button class='text-lg px-5' on:click={() => {is_visible = false}}>
          <CarbonCloseOutline />
        </button>
      </div>
    </div>

    <!-- BUTTON OVERLAY -->
    <div class='absolute w-[73px] h-[100px] flex-row z-10 pointer-events-none'>
      <!-- PLAYBTN -->    
      <div class='w-full h-[62px] relative bg-neutral-900'>
        <span style='transform: translate(3px, 2px)'>
          {#if !is_playing}
            <IcBaselinePlayCircle class='{currentTrack === null ? 'opacity-50' : ''}' font-size={48}/> 
          {:else}
            <CarbonPauseOutline  class='{currentTrack === null ? 'opacity-50' : ''}' font-size={48} />
          {/if}
        </span>
      </div>
      <!-- PROGRESSBAR -->    
      <div class='w-full h-[40px] bg-neutral-900' />
    </div>

    <!-- DEADZONE -->    
    <div class='absolute bottom-[0px] w-[100px] h-[2px] bg-neutral-900 z-10' />

    <div class='flex w-[73px] h-[100px] items-center' >
      {#if render_sc_player && is_visible}
        <iframe 
          id='soundcloud-iframe'
          class='w-full h-full'
          title="soundcloud player"
          scrolling="no" 
          frameborder="no" 
          src="https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/{jukebox_list[jukebox_index]}&color=%23ff5500&auto_play=false&hide_related=false&show_comments=false&show_user=false&show_reposts=false&show_teaser=false&visual=false">
        </iframe>
      {/if}
    </div>
  </div>
</div>


<style lang='postcss'>
  .marquee {
    width: 100%;
    white-space: nowrap;
    overflow: hidden;
    position: relative;
  }
  
  .marquee .fast { 
    display: inline-block;
    padding-right: 100%; /* Ensure the text starts off-screen */
    animation: marquee 10s linear infinite;
  }

  .marquee .mid {
    display: inline-block;
    padding-right: 100%; /* Ensure the text starts off-screen */
    animation: marquee 15s linear infinite;
  }

  .marquee .slow {
    display: inline-block;
    padding-right: 100%; /* Ensure the text starts off-screen */
    animation: marquee 20s linear infinite;
  }  
  
  @keyframes marquee {
    0% { transform: translateX(100%); }
    100% { transform: translateX(-100%); }
  }
  </style>