<svelte:head>
	<title>Skillset</title>
	<meta name="description" content="Skillset" />
</svelte:head>

<script lang="ts">
	import json from '$json/skills.json'

  type Skills = {
    title: string    
    items: Array<{emoji:string, name:string}>
  }

  let skills: Skills[] = (json as any).list;
</script>

<section id='page-content'>
  <center>
	  <h1 class="is_body">Skillset</h1>    
  </center>
  
  {#if skills.length > 0}
      {#each skills as skill}
        <hr>
        <h2 class='is_body'>{skill.title}</h2>
        <ul>
          {#each skill.items as item}
            <li class='is_highlight'>{item.emoji} {item.name}</li>
          {/each}
        </ul>
      {/each}
  {:else}
    <p>Loading...</p>
  {/if}

</section>

