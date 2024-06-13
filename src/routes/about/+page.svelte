<svelte:head>
	<title>About</title>
	<meta name="description" content="About this app" />
</svelte:head>

<script lang='ts'>

	var dateRef = calculateYearsDifference(new Date(), new Date('2011-12-01'))
	
	function calculateYearsDifference(currentDate: Date, previousDate: Date) {
			const currentYear = currentDate.getFullYear();
			const previousYear = previousDate.getFullYear();

			const currentMonth = currentDate.getMonth();
			const previousMonth = previousDate.getMonth();

			const currentDay = currentDate.getDate();
			const previousDay = previousDate.getDate();

			let yearsDifference = currentYear - previousYear;
			let monthsDifference = currentMonth - previousMonth;
			let daysDifference = currentDay - previousDay;

			if (currentMonth < previousMonth || (currentMonth === previousMonth && currentDay < previousDay)) {
					yearsDifference--;
			}

			if (daysDifference < 0) {
        const previousMonthLastDay = new Date(currentYear, currentMonth, 0).getDate();
        daysDifference += previousMonthLastDay;
        monthsDifference--;

        if (monthsDifference < 0) {
            monthsDifference += 12;
            yearsDifference--;
        }
    }

    return {
        years: Math.abs(yearsDifference),
        months: Math.abs(monthsDifference),
        days: Math.abs(daysDifference)
    };
	}

</script>

<template lang="pug">	
	section#page-content
		center
			h1.is_body Well hello there!
			img(src='https://media.tenor.com/thlpKlB8HVQAAAAi/obi-wan-transparent.gif' alt="alt tag" data-src-title='👋👋👋')
		hr
		p.is_body I'm a passionate web developer with a knack for creating dynamic and user-friendly websites with over 10+ years of experience.  
		p.is_body (To be exact, it's been {dateRef.years} years, {dateRef.months} months, and {dateRef.days} days to date)!
		p.is_body With a solid foundation in both front-end and back-end technologies, I specialize in building responsive and engaging web applications.
		p.is_body My expertise also extends to game development where I enjoy/struggle in crafting immersive and interactive experiences.
		p.is_body A natural - and perhaps at times, obsessive - puzzle solver with a passion for coding, I thrive on challenges and 
		p.is_body continually strive for innovation, creativity, and excellence in my work.
		p.is_body Whether it's coding a sleek website or designing a captivating game, I'm dedicated to delivering high-quality solutions that exceed expectations.
		hr
</template>
