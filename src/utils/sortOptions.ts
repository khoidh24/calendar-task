const sortOptions = (options: { value: string; label: string }[]) => {
  return options.sort((a, b) => {
    const aLabel = a.label.trim().toLowerCase()
    const bLabel = b.label.trim().toLowerCase()

    // Split label into prefix and number if applicable
    const aMatch = aLabel.match(/(\D+)(\d+)?/)
    const bMatch = bLabel.match(/(\D+)(\d+)?/)

    if (aMatch && bMatch) {
      const aPrefix = aMatch[1].trim()
      const bPrefix = bMatch[1].trim()

      // Compare the textual part first
      const prefixComparison = aPrefix.localeCompare(bPrefix, 'vi')
      if (prefixComparison !== 0) return prefixComparison

      // Compare the numerical part if both have numbers
      const aNum = aMatch[2] ? parseInt(aMatch[2], 10) : 0
      const bNum = bMatch[2] ? parseInt(bMatch[2], 10) : 0

      return aNum - bNum
    }

    // Fallback to default string comparison
    return aLabel.localeCompare(bLabel, 'vi')
  })
}

export default sortOptions
