<script lang='ts'>
  import {onMount} from 'svelte'
  import { page } from '$app/stores';
  import MdiWebBox from '~icons/mdi/web-box';
  import AntDesignLinkedinOutlined from '~icons/ant-design/linkedin-outlined';
  import SolarCpuOutline from '~icons/solar/cpu-outline';

  let random_num:number = 0

  onMount(() => {
    pickRandomNumber()
  })

  function removeSlash(str:string):string{
    return str.replace(/^\//, '');
  }

  function pickRandomNumber() {
    // Generate a random number between 1 and 5
    random_num = Math.floor(Math.random() * 13) + 1;
    setTimeout(pickRandomNumber, Math.random() * (7000 - 500) + 500);
  }  



</script>

<div class='w-full text-xs p-2 text-green-500 bg-neutral-900 flex place-content-between' >
  
  <div class='flex w-[150px] items-center'>
    <MdiWebBox />/
    <a class='hover:text-white transition-color ease duration-300' href='/'>{removeSlash('/home')}</a>
    <span>/</span>
    <a class='hover:text-white transition-color ease duration-300' href={$page.route.id}>{removeSlash($page.route.id || "/")}</a>
  </div>

  <div class='flex w-[200px] gap-1 '>
    <a href='https://www.linkedin.com/in/allen-royston/' target='_blank' class='flex gap-1 hover:text-white transition-color ease duration-300 items-center'>
      <AntDesignLinkedinOutlined />
      Jyn Royston - Dev For Hire
    </a>
  </div>

  <div class='flex gap-3'>
    <span class='w-[100px]'>[REACTED]: 0/27</span>
    <span class='w-[140px] flex gap-1 text-right justify-end items-center'> <SolarCpuOutline /> AI Core Usage: {7 + random_num}%</span>
  </div>
</div>