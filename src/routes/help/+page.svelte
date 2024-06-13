<svelte:head>
	<title>Help</title>
	<meta name="description" content="Help" />
</svelte:head>

<script lang='ts'>
	import { unlockedStateDict, shouldReparse } from '$stores/store'

	// sends the signal to reparse the html and rebuild in the drawers component
	$:{
		if($unlockedStateDict){
			$shouldReparse = true
			setTimeout(() => {
				$shouldReparse = false
			}, 1)
		}
	}

</script>


<section id='page-content'>
		<center>
			<h1 class="is_body">{$unlockedStateDict.enable_help ? 'HELP' : 'UNABLE TO ACCESS'}</h1>
		</center>
		{#if $unlockedStateDict.enable_help}
			
			<div>
					<!-- Languages Section -->
					{#if !$unlockedStateDict.enable_console}
						<h2 class="is_body">[REDACTED]</h2>	
					{:else}
						<hr>
						<h2 class="is_body">Using the console</h2>
						<p class="is_highlight">Pressing the [F1] key opens console</p>
						<p class="is_highlight">Available commands</p>
						<hr>
						<ul>
							<li>[REDACTED]</li>
							<li class='is_highlight'>music</li>
							<li>[REDACTED]</li>
							<li>[REDACTED]</li>
							<li class='is_highlight'>ls</li>
							<li>[REDACTED]</li>
						</ul>
					{/if}
			</div>
		{/if}
</section>
