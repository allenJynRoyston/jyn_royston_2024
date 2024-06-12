<script lang='ts'>
	import { routes } from '../routes';

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

		return Array.from(filteredRoutes);
	}

	function makeReadable(str:string):string{
		return str.replace('/', '')
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
