// We can validate using the pure formula
const sponsors = [
  { id: 'google', name: 'Google', rank: 1 },
  { id: 'apple', name: 'Apple', rank: 2 },
  { id: 'tata', name: 'Tata Sustainability', rank: 3 },
  { id: 'intel', name: 'Intel', rank: 4 },
  { id: 'tcs', name: 'TCS', rank: 5 },
  { id: 'infosys', name: 'Infosys', rank: 6 },
  { id: 'dell', name: 'Dell Technologies', rank: 7 },
  { id: 'tesla', name: 'Tesla Energy', rank: 8 }
]

const gridSpacing = 5.2
const requiredMargin = 1.0

const configs = sponsors.map((sponsor, index) => {
  const row = Math.floor(index / 3) - 1
  const col = (index % 3) - 1
  const posX = col * gridSpacing
  const posZ = row * gridSpacing

  const normalizedRank = (8 - sponsor.rank) / 7
  const treeHeight = 2.45 + normalizedRank * 1.25
  const canopyRadius = 1.18 + normalizedRank * 0.22
  const baseMoundRadius = 0.82

  return {
    name: sponsor.name,
    rank: sponsor.rank,
    pos: [posX, 0, posZ],
    treeHeight,
    canopyRadius,
    baseMoundRadius
  }
})

console.log('=== CYBERNETIC TREE SPATIAL VALIDATION REPORT ===')
console.log(`Configured Grid Spacing: ${gridSpacing} units`)
console.log(`Required Minimum Margin: ${requiredMargin} units`)
console.log(`Tree Count: ${configs.length} trees`)

let isValid = true
let minDistance = Infinity
let minMargin = Infinity
let pairCount = 0

for (let i = 0; i < configs.length; i++) {
  const a = configs[i]
  for (let j = i + 1; j < configs.length; j++) {
    const b = configs[j]
    const dx = a.pos[0] - b.pos[0]
    const dz = a.pos[2] - b.pos[2]
    const dist = Math.hypot(dx, dz)
    const sumR = a.canopyRadius + b.canopyRadius
    const margin = dist - sumR
    pairCount++

    if (dist < minDistance) minDistance = dist
    if (margin < minMargin) minMargin = margin

    if (margin < requiredMargin) {
      isValid = false
      console.error(`FAIL: ${a.name} <-> ${b.name}: dist=${dist.toFixed(2)}, sumR=${sumR.toFixed(2)}, margin=${margin.toFixed(2)}`)
    }
  }
}

console.log(`Total Pairs Evaluated: ${pairCount} pairs`)
console.log(`Minimum Center Distance: ${minDistance.toFixed(3)} units`)
console.log(`Minimum Canopy Clearance Margin: ${minMargin.toFixed(3)} units (Required: >= ${requiredMargin})`)
console.log(`Overlap Validation Passed: ${isValid ? 'YES (100% CLEAR)' : 'NO'}`)

if (!isValid) process.exit(1)
