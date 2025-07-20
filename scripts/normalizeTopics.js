const fs = require('fs');
const path = require('path');

/**
 * Simple heuristic based canonical topic mapping.
 * Extend or modify this map to refine groupings.
 * Keys are substrings to look for (case-insensitive),
 * values are the canonical topic name to assign.
 */
const canonicalMap = [
  ['trie', 'Trie'],
  ['binary search tree', 'BST'],
  ['avl', 'AVL Tree'],
  ['red-black', 'Red-Black Tree'],
  ['binary search', 'Binary Search'],
  ['sliding window', 'Sliding Window'],
  ['two pointers', 'Two Pointers'],
  ['dynamic programming', 'Dynamic Programming'],
  ['greedy', 'Greedy'],
  ['segment tree', 'Segment Tree'],
  ['heap', 'Heap'],
  ['linked list', 'Linked List'],
  ['string', 'Strings'],
  ['array', 'Arrays'],
  ['matrix', 'Matrices / 2D Arrays'],
  ['graph', 'Graphs'],
  ['bit', 'Bit Manipulation'],
  ['stack', 'Stack'],
  ['queue', 'Queue'],
  ['backtracking', 'Backtracking'],
  ['breadth first search', 'BFS'],
  ['depth first search', 'DFS'],
  ['prefix sum', 'Prefix Sum'],
  ['xor', 'Bit Manipulation'],
  ['kmp', 'KMP Algorithm'],
  ['rolling hash', 'Rolling Hash'],
  ['pattern', 'Pattern Matching'],
];

function canonicalize(rawTopic) {
  const lower = rawTopic.toLowerCase();
  for (const [substr, canon] of canonicalMap) {
    if (lower.includes(substr)) return canon;
  }
  // Default: Title-case first letter of each word (simple tidy up)
  return rawTopic
    .split(/[^a-zA-Z0-9]+/)
    .filter(Boolean)
    .map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(' ');
}

const dataPath = path.resolve(__dirname, '../prisma/seed/data.json');
const json = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

const canonicalTopicsSet = new Set();
const topicMapping = {};

// Remove duplicate questions by title (case-insensitive)
const seenTitles = new Set();
json.questions = json.questions.filter(q => {
  // skip if link is null/undefined/empty string
  if (!q.link) return false;
  const key = (q.title || '').trim().toLowerCase();
  if (seenTitles.has(key)) return false;
  seenTitles.add(key);
  return true;
});

// 1. Build mapping for existing topics
json.topics.forEach(t => {
  const canon = canonicalize(t.name);
  topicMapping[t.name] = canon;
  canonicalTopicsSet.add(canon);
});

// 2. Canonicalize all question topic arrays
json.questions.forEach(q => {
  if (Array.isArray(q.topics)) {
    q.topics = q.topics.map(t => topicMapping[t] || canonicalize(t));
    // Remove duplicates and sort
    q.topics = [...new Set(q.topics)].sort();
    // add to master set
    q.topics.forEach(tn => canonicalTopicsSet.add(tn));
  }
});

// 3. Replace topics list with deduped canonical list
json.topics = [...canonicalTopicsSet].sort().map(name => ({ name }));

const outPath = path.resolve(__dirname, '../prisma/seed/data.cleaned.json');
fs.writeFileSync(outPath, JSON.stringify(json, null, 2));

console.log(`Normalized topics written to ${outPath}`);
