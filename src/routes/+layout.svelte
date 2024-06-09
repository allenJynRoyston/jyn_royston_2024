<script lang='ts'>
	import './styles.css';

	import Drawers from '$components/Drawers.svelte'
	import Header from '$components/Header.svelte';	
	import Footer from '$components/Footer.svelte';	


</script>


<div id="component-container" class="flex flex-col h-screen w-screen bg-slate-800 overflow-hidden gap-1">
	<Drawers />

  <div id="hidden-content" class="hidden">
		<Header />
    <slot></slot>
		<Footer />
  </div>
</div>

