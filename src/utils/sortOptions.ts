const sortOptions = (options: { value: string; label: string }[]) => {
	return options.sort((a, b) => {
		const aLabel = a.label.toLowerCase()
		const bLabel = b.label.toLowerCase()

		// Extract leading numbers if they exist
		const aMatch = aLabel.match(/^(\d+)/)
		const bMatch = bLabel.match(/^(\d+)/)

		// If both start with numbers, compare numerically
		if (aMatch && bMatch) {
			return parseInt(aMatch[1]) - parseInt(bMatch[1])
		}

		// If only one starts with a number, put it first
		if (aMatch) return -1
		if (bMatch) return 1

		// Otherwise, sort alphabetically
		return aLabel.localeCompare(bLabel, 'vi')
	})
}

export default sortOptions
