interface SyllableCount {
  word: string
  count: number
}

interface MeterAnalysis {
  syllables: SyllableCount[]
  pattern: string // e.g., "stressed-unstressed" for iambic
}

interface RhymeAnalysis {
  lines: string[]
  scheme: string[] // e.g., ["a", "b", "a", "b"] for alternate rhyme
}

// Dictionary of common word syllable counts
const syllableCounts: Record<string, number> = {
  the: 1,
  a: 1,
  an: 1,
  and: 1,
  or: 1,
  but: 1,
  // Add more common words...
}

// Common poetry meters
const meters = {
  iambic: "unstressed-stressed",
  trochaic: "stressed-unstressed",
  anapestic: "unstressed-unstressed-stressed",
  dactylic: "stressed-unstressed-unstressed",
}

export function countSyllables(word: string): number {
  // Remove punctuation and convert to lowercase
  word = word.toLowerCase().replace(/[^a-z]/g, '')

  // Check dictionary first
  if (syllableCounts[word]) {
    return syllableCounts[word]
  }

  // Basic syllable counting algorithm
  const vowels = 'aeiouy'
  let count = 0
  let prevVowel = false

  for (let i = 0; i < word.length; i++) {
    const isVowel = vowels.includes(word[i])
    if (isVowel && !prevVowel) {
      count++
    }
    prevVowel = isVowel
  }

  // Handle silent e
  if (word.length > 2 && word.endsWith('e')) {
    count--
  }

  return count || 1 // Ensure at least one syllable
}

export function analyzeMeter(line: string): MeterAnalysis {
  const words = line.trim().split(/\s+/)
  const syllables = words.map(word => ({
    word,
    count: countSyllables(word)
  }))

  // Basic meter detection
  let pattern = ''
  let totalSyllables = 0

  syllables.forEach(({ count }) => {
    for (let i = 0; i < count; i++) {
      pattern += totalSyllables % 2 === 0 ? 'stressed-' : 'unstressed-'
      totalSyllables++
    }
  })

  pattern = pattern.slice(0, -1) // Remove trailing hyphen

  return {
    syllables,
    pattern
  }
}

export function analyzeRhyme(lines: string[]): RhymeAnalysis {
  const rhymeScheme: string[] = []
  const rhymeGroups: Map<string, string> = new Map()
  let nextRhyme = 'a'

  // Get last word of each line
  const endWords = lines.map(line => {
    const words = line.trim().split(/\s+/)
    return words[words.length - 1].toLowerCase().replace(/[^a-z]/g, '')
  })

  // Assign rhyme letters
  endWords.forEach((word, i) => {
    // Check if this end sound has been seen before
    let foundRhyme = false
    for (const [sound, letter] of rhymeGroups.entries()) {
      if (soundsLike(word, sound)) {
        rhymeScheme[i] = letter
        foundRhyme = true
        break
      }
    }

    // If no rhyme found, assign new letter
    if (!foundRhyme) {
      rhymeGroups.set(word, nextRhyme)
      rhymeScheme[i] = nextRhyme
      nextRhyme = String.fromCharCode(nextRhyme.charCodeAt(0) + 1)
    }
  })

  return {
    lines,
    scheme: rhymeScheme
  }
}

// Very basic "sounds like" comparison
function soundsLike(word1: string, word2: string): boolean {
  // For now, just check if words end with the same letters
  const length = Math.min(word1.length, word2.length)
  const ending1 = word1.slice(-length)
  const ending2 = word2.slice(-length)
  return ending1 === ending2
}

export function getPoetryStats(text: string) {
  const lines = text.split('\n').filter(line => line.trim())
  const totalLines = lines.length
  const syllableCounts = lines.map(line => 
    line.split(/\s+/)
      .map(word => countSyllables(word))
      .reduce((a, b) => a + b, 0)
  )
  const averageSyllables = syllableCounts.reduce((a, b) => a + b, 0) / totalLines
  const rhymeAnalysis = analyzeRhyme(lines)
  const meterAnalyses = lines.map(analyzeMeter)

  return {
    totalLines,
    syllableCounts,
    averageSyllables,
    rhymeScheme: rhymeAnalysis.scheme,
    meterPatterns: meterAnalyses.map(m => m.pattern)
  }
} 