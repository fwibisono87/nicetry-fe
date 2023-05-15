export function dateFormatter(dateString: string) {
	const dateObj = new Date(dateString);
	// add 7 hours to the date
	dateObj.setHours(dateObj.getHours() + 7);

	// Output the date in a human-readable format
    let humanReadableDate = dateObj.toLocaleString();
    return humanReadableDate;
}

export function rupiahFormatter(amount: number) {
	let formatter = new Intl.NumberFormat('id-ID', {
		style: 'currency',
		currency: 'IDR',
		minimumFractionDigits: 0
	});

	return formatter.format(amount);
}
