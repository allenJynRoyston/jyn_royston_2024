<script lang='ts'>
	import './styles.css';

	import Drawers from '$components/Drawers.svelte'
	import Header from '$components/Header.svelte';	
	import Footer from '$components/Footer.svelte';	


</script>


<div id="component-container" class="flex flex-col h-screen w-screen bg-slate-900 overflow-hidden gap-1">
	<Drawers />

  <div id="hidden-content" class="hidden">
		<Header />
    <slot></slot>
		<Footer />
  </div>
</div>

<style lang='postcss'>
			body, html {
					margin: 0;
					padding: 0;
					height: 100%;
					font-family: Arial, sans-serif;
			}
</style>

