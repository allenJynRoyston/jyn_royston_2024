<script>
	import Header from '$components/Header.svelte';
</script>

<svelte:head>
	<title>Jyn Royston</title>
	<meta name="description" content="Allen 'Jyn' Royston - Fullstack developer" />
</svelte:head>

<template lang="pug">
	section#page-content
		center
			h1.is_highlight Jyn Royston
			h2.is_highlight Fullstack Developer / Frontend Specialist
			img(src='https://media.licdn.com/dms/image/C4E03AQGJT3TlIEB5xg/profile-displayphoto-shrink_800_800/0/1516982077919?e=1723680000&v=beta&t=PEkI-WTlVxDchGfFVvq_w11aPC-LasVKmLDm8H4hAC8' alt="alt tag" data-src-title='(This is me)')
		br
		hr
		br
		center
			p.is_body Web Dev and Indie game developer			
			p.is_body Reliable ⭐ Creative ⭐ Innovative
		hr
		
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
