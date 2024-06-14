<script lang='ts'>
  import { spring, tweened  } from 'svelte/motion';

  export let show:boolean = false
  export let onAnimationComplete: () => void = () => {};


  let pos = spring({ x: 0, y: 0 }, { stiffness: 0.1, damping: 0.25 });

  $:{
    if(show){
      pos.set({ x: 0, y: 50 });
      setTimeout(() => {
        onAnimationComplete()
      }, 700)
    }
    else{
      pos.set({ x: 0, y: 0 })
    }
  }

</script>

<div class='absolute flex items-center justify-center z-40 top-0 left-0 w-full h-full text-black'>
  <div class="modal absolute bg-slate-300 px-10 py-5 flex flex-col gap-1 items-center justify-center rounded-sm" style="transform: translate({$pos.x}px, {$pos.y-20}px);">
    <slot />
  </div>
</div>