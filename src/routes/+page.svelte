<script>
	import Header from '$components/Header.svelte';
</script>

<svelte:head>
	<title>Blastzone</title>
	<meta name="description" content="Allen 'Jyn' Royston - Fullstack developer for hire!" />
</svelte:head>

<template lang="pug">
	section
		h1.is_green Jyn Royston
		h3.is_green Developer for hire
		h4.is_green +10 Years of Experience
		h5.is_green Mystery Solver
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
