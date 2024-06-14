<script lang='ts'>
  import { onMount } from 'svelte';

  let requestId
  let counter:number = 0
  let fadeColor:number = 0

  // Function to calculate direction vector
  const dir = function(l, radi) {
    return [l * Math.sin(radi), l * Math.cos(radi)];
  };

  
  onMount(() => {
    let canvas = document.getElementById('canvas-fx');
    let ctx = canvas.getContext('2d');

    // Set initial canvas size
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Define the Parts class
    function Parts(x, y) {
      this.pos = [x, y];
    }

    Parts.prototype.upd = function(ctx) {
      let _arr2 = [];
      _arr2[0] = this.pos[0];
      _arr2[1] = this.pos[1];

      // Calculate noise for movement
      const res = dir(50, 1);

      _arr2[0] += res[0];
      _arr2[1] += res[1];

      // Draw the line segment
      ctx.beginPath();
      ctx.moveTo(_arr2[0], _arr2[1]);
      ctx.lineTo(this.pos[0], this.pos[1]);
      ctx.stroke();

      this.pos[0] = _arr2[0];
      this.pos[1] = _arr2[1];

      // Reset position if out of bounds
      if (this.pos[0] < 0 || this.pos[0] > canvas.width || this.pos[1] < 0 || this.pos[1] > canvas.height) {
        this.pos[0] = Math.floor(Math.random() * canvas.width);
        this.pos[1] = Math.floor(Math.random() * canvas.height);
      }
    };

    // Initialize array of Parts objects
    const _arr3 = [];
    for (let i = 0; i < 5000; i++) {
      _arr3.push(new Parts(Math.floor(Math.random() * canvas.width), Math.floor(Math.random() * canvas.height)));
    }

    // set colors and fill
    ctx.fillStyle = 'hsla(0, 0%, 0%, .04)';
    ctx.strokeStyle = `hsla(${Math.floor(Math.random() * 256)}, 95%, 5%, 1)`;      

    function changeColor(){
      fadeColor += 10
      ctx.strokeStyle = `hsla(${fadeColor}, 95%, 5%, 1)`;  
      if(fadeColor > 255){
        fadeColor = 0
      }    
    }


    function go() {
      if(counter === 0){
        changeColor()
      }
      
      counter ++

      if(counter > 60){
        counter = 0
      }


      ctx.globalCompositeOperation = 'source-over';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.globalCompositeOperation = 'lighter';
      for (let i = 0; i < _arr3.length; i++) {
        _arr3[i].upd(ctx);
      }
      requestId = window.requestAnimationFrame(go);
    }

    go();


    return () => {
      window.cancelAnimationFrame(requestId);
    };
  });

</script>


<canvas id="canvas-fx" class='absolute top-0 left-0 w-full h-full pointer-events-none opacity-20' />

