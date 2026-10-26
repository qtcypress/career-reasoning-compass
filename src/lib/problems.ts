export type CodingProblem = {
  id: string;
  title: string;
  difficulty: "Easy" | "Medium" | "Hard";
  topics: string[];
  statement: string;
  constraints: string[];
  examples: { input: string; output: string; explanation: string }[];
};

// Independently worded versions of established interview questions.
export const PROBLEMS: CodingProblem[] = [
  {
    id: "two-sum", title: "Two Sum", difficulty: "Easy", topics: ["Arrays", "Hash tables"],
    statement: "Given an integer array nums and an integer target, return the indices of two different elements whose sum equals target. Exactly one pair exists. You may return the two indices in either order; the same array element cannot be used twice.",
    constraints: ["2 ≤ nums.length ≤ 10,000", "−1,000,000,000 ≤ nums[i], target ≤ 1,000,000,000", "Exactly one valid pair exists."],
    examples: [{ input: "nums = [2, 7, 11, 15], target = 9", output: "[0, 1]", explanation: "The values at indices 0 and 1 add to 9." }, { input: "nums = [3, 3], target = 6", output: "[0, 1]", explanation: "Equal values are allowed, but their indices must differ." }],
  },
  {
    id: "valid-parentheses", title: "Valid Parentheses", difficulty: "Easy", topics: ["Strings", "Stacks"],
    statement: "Determine whether a string containing only (, ), [, ], {, and } is balanced. Each closing bracket must match the most recent unmatched opening bracket of the same type. Every opening bracket must eventually be closed.",
    constraints: ["1 ≤ s.length ≤ 10,000", "Only the six bracket characters may occur."],
    examples: [{ input: 's = "([]){}"', output: "true", explanation: "Each pair closes in the correct nesting order." }, { input: 's = "([)]"', output: "false", explanation: "The round bracket closes while a square bracket is still open." }],
  },
  {
    id: "best-time-to-buy-and-sell-stock", title: "Best Time to Buy and Sell Stock", difficulty: "Easy", topics: ["Arrays"],
    statement: "prices[i] is a stock's price on day i. Find the largest profit possible from buying once and selling once on a later day. Return 0 when no profitable transaction exists. You may not sell before you buy.",
    constraints: ["1 ≤ prices.length ≤ 100,000", "0 ≤ prices[i] ≤ 10,000"],
    examples: [{ input: "prices = [7, 1, 5, 3, 6, 4]", output: "5", explanation: "Buy at 1 and sell later at 6." }, { input: "prices = [7, 6, 4, 3, 1]", output: "0", explanation: "Every later selling price is lower." }],
  },
  {
    id: "reverse-linked-list", title: "Reverse Linked List", difficulty: "Easy", topics: ["Linked lists"],
    statement: "Given the head of a singly linked list, reverse its next pointers and return the new head. An empty list should return null. Describe how you preserve access to the remaining nodes while changing pointers.",
    constraints: ["0 ≤ number of nodes ≤ 5,000", "−5,000 ≤ node.val ≤ 5,000"],
    examples: [{ input: "head = [1, 2, 3, 4]", output: "[4, 3, 2, 1]", explanation: "The former tail becomes the head." }, { input: "head = []", output: "[]", explanation: "There are no pointers to reverse." }],
  },
  {
    id: "longest-substring-without-repeating-characters", title: "Longest Substring Without Repeating Characters", difficulty: "Medium", topics: ["Strings", "Sliding window", "Hash tables"],
    statement: "Return the length of the longest contiguous substring of s that contains no repeated characters. Characters include spaces and symbols; matching is case-sensitive. A substring must be contiguous, unlike a subsequence.",
    constraints: ["0 ≤ s.length ≤ 50,000", "s consists of English letters, digits, symbols, and spaces."],
    examples: [{ input: 's = "abcabcbb"', output: "3", explanation: '"abc" is a longest valid substring.' }, { input: 's = "pwwkew"', output: "3", explanation: '"wke" is valid; "pwke" is not contiguous.' }],
  },
  {
    id: "merge-intervals", title: "Merge Intervals", difficulty: "Medium", topics: ["Arrays", "Sorting"],
    statement: "Given a list of closed intervals [start, end], merge every overlapping group and return non-overlapping intervals covering exactly the same points. Input order is arbitrary. Intervals sharing an endpoint overlap.",
    constraints: ["1 ≤ intervals.length ≤ 10,000", "0 ≤ start ≤ end ≤ 10,000"],
    examples: [{ input: "intervals = [[1,3], [2,6], [8,10], [15,18]]", output: "[[1,6], [8,10], [15,18]]", explanation: "The first two intervals overlap." }, { input: "intervals = [[1,4], [4,5]]", output: "[[1,5]]", explanation: "The shared endpoint 4 makes them overlap." }],
  },
  {
    id: "binary-tree-level-order-traversal", title: "Binary Tree Level Order Traversal", difficulty: "Medium", topics: ["Trees", "Breadth-first search"],
    statement: "Given a binary tree root, return its node values grouped by depth, starting at the root. Within each level, visit nodes from left to right. Return an empty list for an empty tree. Examples represent trees in level order with null for missing children.",
    constraints: ["0 ≤ number of nodes ≤ 2,000", "−1,000 ≤ node.val ≤ 1,000"],
    examples: [{ input: "root = [3,9,20,null,null,15,7]", output: "[[3], [9,20], [15,7]]", explanation: "There are three levels, with the children of 20 on the last level." }, { input: "root = []", output: "[]", explanation: "An empty tree has no levels." }],
  },
  {
    id: "number-of-islands", title: "Number of Islands", difficulty: "Medium", topics: ["Graphs", "Breadth-first search"],
    statement: "Count islands in a rectangular grid of '1' (land) and '0' (water). Land cells belong to the same island if connected horizontally or vertically, not diagonally. The region outside the grid is water.",
    constraints: ["1 ≤ rows, columns ≤ 300", "Every cell is '0' or '1'."],
    examples: [{ input: 'grid = [["1","1","0"], ["0","1","0"], ["0","0","1"]]', output: "2", explanation: "The bottom-right cell is not connected diagonally to the other land." }, { input: 'grid = [["0","0"]]', output: "0", explanation: "All cells are water." }],
  },
  {
    id: "coin-change", title: "Coin Change", difficulty: "Medium", topics: ["Dynamic programming"],
    statement: "Given positive coin denominations and a non-negative amount, return the fewest coins needed to form that amount exactly. Each denomination may be used any number of times. Return −1 if the amount is impossible, and 0 for amount 0.",
    constraints: ["1 ≤ coins.length ≤ 12", "1 ≤ coins[i] ≤ 2,147,483,647", "0 ≤ amount ≤ 10,000"],
    examples: [{ input: "coins = [1,2,5], amount = 11", output: "3", explanation: "5 + 5 + 1 uses three coins." }, { input: "coins = [2], amount = 3", output: "-1", explanation: "No combination of 2s sums to 3." }],
  },
  {
    id: "lru-cache", title: "LRU Cache", difficulty: "Medium", topics: ["Design", "Hash tables", "Linked lists"],
    statement: "Design an LRUCache with positive capacity. get(key) returns its value or −1 if absent. put(key, value) inserts or updates a key; when capacity is exceeded, evict the least recently used key. Successful get and every put make that key most recently used. Both operations must take O(1) average time.",
    constraints: ["1 ≤ capacity ≤ 3,000", "0 ≤ key ≤ 10,000; 0 ≤ value ≤ 100,000", "At most 200,000 get and put calls."],
    examples: [{ input: "capacity=2; put(1,1); put(2,2); get(1); put(3,3); get(2)", output: "get(1) → 1; get(2) → -1", explanation: "Accessing key 1 makes key 2 least recent, so inserting key 3 evicts key 2." }, { input: "capacity=1; put(1,1); put(1,9); get(1)", output: "9", explanation: "Updating a key does not add an extra entry." }],
  },
  {
    id: "trapping-rain-water", title: "Trapping Rain Water", difficulty: "Hard", topics: ["Arrays", "Two pointers"],
    statement: "An array height represents non-negative bar heights, each of width 1. Calculate the total units of water held between the bars after rain. Water cannot be retained beyond the left or right boundaries.",
    constraints: ["1 ≤ height.length ≤ 20,000", "0 ≤ height[i] ≤ 100,000"],
    examples: [{ input: "height = [0,1,0,2,1,0,1,3,2,1,2,1]", output: "6", explanation: "The enclosed depressions hold six units in total." }, { input: "height = [4,2,0,3,2,5]", output: "9", explanation: "The four inner bars hold 2, 4, 1, and 2 units." }],
  },
  {
    id: "median-of-two-sorted-arrays", title: "Median of Two Sorted Arrays", difficulty: "Hard", topics: ["Arrays", "Binary search"],
    statement: "Given two arrays sorted in non-decreasing order, return the median of all their elements combined. For an even total length, use the average of the two central values. At least one array is non-empty. Your algorithm must run in O(log(m + n)) time, where m and n are the array lengths.",
    constraints: ["0 ≤ m, n ≤ 1,000", "1 ≤ m + n ≤ 2,000", "−1,000,000 ≤ array values ≤ 1,000,000"],
    examples: [{ input: "nums1 = [1,3], nums2 = [2]", output: "2.0", explanation: "The combined sorted order is [1,2,3]." }, { input: "nums1 = [1,2], nums2 = [3,4]", output: "2.5", explanation: "Average the middle values 2 and 3." }],
  },
];

export const TOPICS = [...new Set(PROBLEMS.flatMap((p) => p.topics))].sort();
export const getProblem = (id: string | undefined) => PROBLEMS.find((p) => p.id === id);
export const sourceUrl = (p: CodingProblem) => `https://leetcode.com/problems/${p.id}/`;
export function filterProblems(query: string, difficulty: string, topic: string) {
  const needle = query.trim().toLowerCase();
  return PROBLEMS.filter((p) =>
    (difficulty === "All" || p.difficulty === difficulty) &&
    (topic === "All" || p.topics.includes(topic)) &&
    `${p.title} ${p.topics.join(" ")} ${p.statement}`.toLowerCase().includes(needle),
  );
}
export function problemPrompt(p: CodingProblem) {
  return `${p.title}\n\n${p.statement}\n\nConstraints:\n${p.constraints.join("\n")}\n\nExamples:\n${p.examples.map((e) => `Input: ${e.input}\nOutput: ${e.output}\nExplanation: ${e.explanation}`).join("\n\n")}`;
}