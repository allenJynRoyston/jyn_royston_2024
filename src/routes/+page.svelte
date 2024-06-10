<script>
	import Header from '$components/Header.svelte';
</script>

<svelte:head>
	<title>Blastzone</title>
	<meta name="description" content="Allen 'Jyn' Royston - Fullstack developer" />
</svelte:head>

<template lang="pug">
	section
		h1.is_highlight Jyn Royston
		img(src='https://picsum.photos/200/300' alt="alt tag" data-src-title='(This is me)')
		h2.is_body Fullstack developer / Indie game developer
		h3.is_body Years of experience in the Javascript ecosystem
		h3.is_body Reliable, creative, and team-player
		hr
		h4.is_body [REDACTED] 
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
