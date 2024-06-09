<script>
	import Header from '$components/Header.svelte';
</script>

<svelte:head>
	<title>Blastzone</title>
	<meta name="description" content="Allen 'Jyn' Royston - Fullstack developer for hire!" />
</svelte:head>

<template lang="pug">
	section
		h1.is_highlight Jyn Royston
		h2.is_body Developer for hire
		h3.is_body +10 Years of Experience
		h3.is_body Mystery Solver
</template>

<style lang="postcss">
	section {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		flex: flex-grow;
		background-color: theme(colors.gray.400);
	}
</style>
