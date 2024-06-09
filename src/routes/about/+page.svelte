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


<section>
	<h1 class='is_body'>Why hello there!</h1>
	<p class='is_body'> My name is Jyn, and I'm a developer with over {dateRef.years}+ years of experience!</p>
	<p class='is_highlight'>(In fact, it's closer to {dateRef.years} years, {dateRef.months} months, and {dateRef.days} days to be exact!)</p>
	<p class='is_body'> When I'm not doing web stuff, I'm doing game stuff.</p>
</section>

