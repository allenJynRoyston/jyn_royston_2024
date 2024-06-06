<script>
	import Counter from '$components/Counter.svelte';
</script>

<svelte:head>
	<title>Blastzone</title>
	<meta name="description" content="Allen 'Jyn' Royston - Fullstack developer for hire!" />
</svelte:head>

<section>
	<h1 class="text-3xl font-bold underline">
		Hello world!
	</h1>
	
	<Counter />
</section>

<style lang="postcss">
	section {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		flex: 0.6;
		background-color: theme(colors.gray.400);
	}

	h1 {
		width: 100%;
	}


</style>
