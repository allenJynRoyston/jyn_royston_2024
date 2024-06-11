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
		h2.is_body I build unique websites and games.
		img(src='https://media.licdn.com/dms/image/C4E03AQGJT3TlIEB5xg/profile-displayphoto-shrink_800_800/0/1516982077919?e=1723680000&v=beta&t=PEkI-WTlVxDchGfFVvq_w11aPC-LasVKmLDm8H4hAC8' alt="alt tag" data-src-title='(This is me)')
		hr
		h2.is_body Fullstack developer / Indie game developer
		h3.is_body Years of experience
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
