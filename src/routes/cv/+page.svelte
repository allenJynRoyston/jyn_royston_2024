<svelte:head>
	<title>Curriculum Vitae</title>
	<meta name="description" content="Curriculum Vitae" />
</svelte:head>

<script lang="ts">
	import cv from '$json/cv.json'
  import {consoleUnlockedStateDict} from '$stores/store'

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
      <a class='is_link' href={experience.link} target="_blank">{experience.website}</a>
      <ul>
        {#each experience.tasks as task}
          <li class='is_highlight'>{task}</li>
        {/each}
      </ul>
      <hr>
      <br>
      <br>
    {/each}

    {#if $consoleUnlockedStateDict.unlocked_hidden_job}
      <hr>
      <h2 class='is_body'>WORLDLESS VOID INC</h2>
      <ul>
        <li class='is_highlight'>Conducted Esoteric Research: Performed extensive research into ancient texts and forbidden knowledge, deciphering cryptic runes and languages not spoken for millennia.</li>
        <li class='is_highlight'>Executed Rituals of Binding: Conducted complex and precise rituals to bind eldritch entities, ensuring their continued dormancy and preventing their influence on the physical world.</li>
        <li class='is_highlight'>Managed Confidential Archives: Maintained highly classified records of supernatural occurrences, ensuring all documentation remained secure and undisclosed to the public.</li>
        <li>In shadows deep where secrets creep, A realm where nightmares never sleep, Amongst the whispers, cold and low, There lies a truth few dare to know. 🔑 FREE_ME_FROM_HERE</li>
      </ul>
      <hr>
      <br>
      <br>
    {/if}
    
  {:else}
    <p>Loading...</p>
  {/if}

</section>

