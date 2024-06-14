<svelte:head>
	<title>Help</title>
	<meta name="description" content="Help" />
</svelte:head>

<script lang='ts'>
	import { codeStateDict, consoleUnlockedStateDict, shouldReparse } from '$stores/store'

	// sends the signal to reparse the html and rebuild in the drawers component
	$:{
		if($codeStateDict){
			$shouldReparse = true
			setTimeout(() => {
				$shouldReparse = false
			}, 1)
		}
	}

</script>


<section id='page-content'>
		<center>
			<h1 class="is_body">{$codeStateDict.enable_help ? 'HELP' : 'UNABLE TO ACCESS'}</h1>
		</center>
		{#if $codeStateDict.enable_help}
			<!-- Languages Section -->
			{#if !$codeStateDict.enable_console}
				<h2 class="is_body">[REDACTED]</h2>	
			{:else}
				<hr>
				<h2 class="is_body">Using the console</h2>
				<p class="is_highlight">Pressing the "c" key opens console</p>
				<p class="is_highlight">Available commands</p>
				
				<ul>
					<li class='is_highlight'>$:🔑</li>
					<li>[REDACTED]</li>
					<li class='is_highlight'>$:unlock music</li>
					<li>[REDACTED]</li>
					<li>[REDACTED]</li>
					
					<li>[REDACTED]</li>
				</ul>
				<hr>
				<br>
				<br>
			{/if}


			<!-- Languages Section -->
			{#if !$consoleUnlockedStateDict.unlocked_music_player}
				<h2 class="is_body">[REDACTED]</h2>	
			{:else}
				<hr>
				<h2 class="is_body">Using the music player</h2>
				<p class="is_highlight">Pressing the "m" key opens console</p>
				<hr>
			{/if}			

		{/if}
</section>
