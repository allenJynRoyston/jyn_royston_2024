<script lang='ts'>
	import { routes } from '../routes';
	import { codeStateDict, shouldReparse, shouldRedraw } from '$stores/store'

	let routeList:Array<string> = parseRoutes(routes)

	function parseRoutes(routes:Array<string>):Array<string> {
		const filteredRoutes = new Set<string>();

		routes.forEach(route => {
			// Ignore routes starting with '+'
			if (!route.startsWith('/+')) {
				// Extract the first level of the route
				const firstLevelRoute = route.split('/')[1];

				// If the route has only one level and does not start with '+'
				if (firstLevelRoute && !firstLevelRoute.startsWith('+')) {
					filteredRoutes.add(`/${firstLevelRoute}`);
				}
			}
		});

		let filtered:string[] = Array.from(filteredRoutes)
		// removes /help route
		filtered = filtered.filter((route:string) => {return route !== '/help'})

		// ... then adds it to the bottom
		if($codeStateDict.enable_help){
			filtered.push('/help')
		}

		return filtered;
	}

	function makeReadable(str:string):string{
		return str.replace('/', '')
	}

	let previous_help_state:boolean | null = null

	$: {
 	 	if(previous_help_state !== $codeStateDict.enable_help){
      previous_help_state = $codeStateDict.enable_help
			routeList = parseRoutes(routes)
      $shouldRedraw = true
      $shouldReparse = true
    }
	}
	
</script>

<header>	
	<navigation>
		<a class='is_link capitalize' href="/">home</a>
		{#each routeList as route}
			<a class='is_link capitalize' href={route}>{makeReadable(route)}</a>
		{/each}
	</navigation>
</header>		
