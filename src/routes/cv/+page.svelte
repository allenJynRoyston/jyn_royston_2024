<svelte:head>
	<title>Curriculum Vitae</title>
	<meta name="description" content="Curriculum Vitae" />
</svelte:head>

<script lang="ts">
	import cv from '$json/cv.json'

  type Experience = {
    company: string
    website: string
    tasks: string[]
  }

  let experiences: Experience[] = (cv as any).list;

</script>

<section id='page-content'>
  <center>
    <h1 class="is_body">Curriculm Vitae</h1>
    <h2 class="is_body">2010-2024</h2>
  </center>
  {#if experiences.length > 0}    

    {#each experiences as experience}
      <hr>
      <h2 class='is_body'>{experience.company}</h2>
      <a class='is_link' href={experience.website} target="_blank">{experience.website}</a>
      <ul>
        {#each experience.tasks as task}
          <li class='is_highlight'>{task}</li>
        {/each}
      </ul>
    {/each}

  {:else}
    <p>Loading...</p>
  {/if}

</section>

