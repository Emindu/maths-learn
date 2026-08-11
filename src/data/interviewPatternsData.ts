// Data model + content for the "Programming Interview Patterns" section.
// Based on the 14-pattern framework popularised by "14 LeetCode Patterns to
// Solve Any Question" (Grokking-style pattern list). Only patterns with a
// `content` field are fully built; the rest are roadmap entries that render
// a "coming soon" page until their content lands.

export interface CodeTemplate {
  title: string;
  problem: string;
  code: string;
}

export interface LeetCodeQuestion {
  number: number;
  title: string;
  url: string;
}

export interface PatternVariant {
  title: string;
  description: string;
}

export interface InterviewPatternContent {
  whenToUse: string[];
  technique: string;
  variants?: PatternVariant[];
  codeTemplates: CodeTemplate[];
  questions: LeetCodeQuestion[];
  vizId?: string;
}

export interface InterviewPattern {
  id: string;
  order: number;
  title: string;
  shortDesc: string;
  content?: InterviewPatternContent;
}

export const interviewPatterns: InterviewPattern[] = [
  {
    id: 'sliding-window',
    order: 1,
    title: 'Sliding Window',
    shortDesc: 'Track a contiguous subarray or substring with two pointers to cut O(n²) scans down to O(n).',
    content: {
      whenToUse: [
        'Working with a linear data structure — an array, string, or list',
        'The problem asks you to examine every contiguous subarray or substring',
        'The window must satisfy some condition, and you need the shortest, longest, minimum, or maximum one',
        'A brute-force nested loop would cost O(n²) and you need O(n) instead',
      ],
      technique:
        'Keep two pointers, i and j, marking the ends of a window over the array. Move j forward to expand the window until it breaks your condition, then move i forward to shrink it from the left until the condition holds again. Track the best (shortest or longest) window seen at each step. Because i and j each only ever move forward, the whole scan is O(n) instead of the O(n²) you would pay by checking every subarray from scratch.',
      variants: [
        {
          title: 'Dynamic window',
          description:
            'The window size changes as the algorithm runs — it grows while scanning new elements and shrinks whenever it becomes invalid (e.g. a repeated character). Used for "longest/shortest substring such that..." problems.',
        },
        {
          title: 'Fixed window',
          description:
            'The window size k is fixed for the whole scan. Initialize i and j exactly k apart, then slide both forward together one step at a time, evaluating the window at each position.',
        },
      ],
      codeTemplates: [
        {
          title: 'Dynamic window — shortest valid window',
          problem:
            'General shape: "find the shortest contiguous subarray/substring satisfying condition X." Concrete case — Minimum Window Substring (LeetCode 76): given strings s and t, find the smallest substring of s that contains every character of t (including duplicates). Expand j until the window covers t, then shrink i as far as possible while it still does, recording the smallest valid window seen.',
          code:
`int shortestWindow(int[] nums) {
    int i = 0;
    int minLength = Integer.MAX_VALUE;

    for (int j = 0; j < nums.length; j++) {
        // expand: fold nums[j] into the window state

        while (conditionMet()) {
            minLength = Math.min(minLength, j - i + 1);

            // shrink from the left: remove nums[i] from the window state
            i++;
        }
    }
    return minLength == Integer.MAX_VALUE ? 0 : minLength;
}`,
        },
        {
          title: 'Dynamic window — longest valid window',
          problem:
            'General shape: "find the longest contiguous subarray/substring satisfying condition X." Concrete case — Longest Repeating Character Replacement (LeetCode 424): given a string s and an integer k, you may change up to k characters in any substring to any other character; find the length of the longest substring you can turn into all-one-character. A window is valid while (window length − count of its most frequent character) ≤ k; shrink from the left whenever that breaks.',
          code:
`int longestWindow(int[] nums) {
    int i = 0;
    int maxLength = 0;

    for (int j = 0; j < nums.length; j++) {
        // expand: fold nums[j] into the window state

        while (!conditionMet()) {
            // shrink from the left: remove nums[i] from the window state
            i++;
        }

        maxLength = Math.max(maxLength, j - i + 1);
    }
    return maxLength;
}`,
        },
        {
          title: 'Fixed window of size k',
          problem:
            'General shape: "evaluate every contiguous window of a fixed length k." Concrete case — Substrings of Size Three with Distinct Characters (LeetCode 1876): given a string s, count how many contiguous substrings of length 3 have all distinct characters. Slide a window of exactly 3 characters across s one step at a time and check each one — this is the demo shown in the visualization above.',
          code:
`int fixedWindow(int[] nums, int k) {
    int i = 0;
    int result = 0;

    for (int j = 0; j < nums.length; j++) {
        // expand: fold nums[j] into the window state

        if (j - i + 1 < k) continue;

        // process the window [i, j] here, e.g. update result

        // shrink from the left to keep the window at size k
        // remove nums[i] from the window state
        i++;
    }
    return result;
}`,
        },
        {
          title: 'Worked example — Longest Substring Without Repeating Characters',
          problem:
            'Longest Substring Without Repeating Characters (LeetCode 3): given a string s, find the length of the longest substring that contains no repeated characters. This is a direct instance of the "longest valid window" template above — the window is valid exactly while it contains no duplicate character — and it is the exact algorithm the dynamic-window visualization runs step by step.',
          code:
`int lengthOfLongestSubstring(String s) {
    Set<Character> window = new HashSet<>();
    int i = 0;
    int maxLength = 0;

    for (int j = 0; j < s.length(); j++) {
        char c = s.charAt(j);
        while (window.contains(c)) {
            window.remove(s.charAt(i));
            i++;
        }
        window.add(c);
        maxLength = Math.max(maxLength, j - i + 1);
    }
    return maxLength;
}`,
        },
      ],
      questions: [
        { number: 3, title: 'Longest Substring Without Repeating Characters', url: 'https://leetcode.com/problems/longest-substring-without-repeating-characters/' },
        { number: 424, title: 'Longest Repeating Character Replacement', url: 'https://leetcode.com/problems/longest-repeating-character-replacement/' },
        { number: 1876, title: 'Substrings of Size Three with Distinct Characters', url: 'https://leetcode.com/problems/substrings-of-size-three-with-distinct-characters/' },
        { number: 76, title: 'Minimum Window Substring', url: 'https://leetcode.com/problems/minimum-window-substring/' },
      ],
      vizId: 'viz-sliding-window',
    },
  },
  {
    id: 'two-pointers',
    order: 2,
    title: 'Two Pointers',
    shortDesc: 'Scan from both ends of a sorted array or string inward instead of checking every pair.',
  },
  {
    id: 'fast-slow-pointers',
    order: 3,
    title: 'Fast & Slow Pointers',
    shortDesc: 'One pointer moves twice as fast as the other to detect cycles or find the middle of a list in O(1) space.',
  },
  {
    id: 'linked-list-reversal',
    order: 4,
    title: 'In-Place Linked List Reversal',
    shortDesc: 'Rewire next pointers as you walk the list to reverse it in one pass with no extra space.',
  },
  {
    id: 'binary-search',
    order: 5,
    title: 'Binary Search',
    shortDesc: 'Halve the search space each step to find a target — or a boundary — in sorted or rotated arrays.',
  },
  {
    id: 'top-k-elements',
    order: 6,
    title: 'Top K Elements',
    shortDesc: 'A size-K heap finds the k largest/smallest/most-frequent elements in O(n log k), no full sort needed.',
  },
  {
    id: 'tree-traversal',
    order: 7,
    title: 'Binary Tree Traversal',
    shortDesc: 'Preorder, inorder, postorder, and level-order — the four ways to visit every node in a tree.',
  },
  {
    id: 'graphs-matrices',
    order: 8,
    title: 'Graphs & Matrices (BFS/DFS)',
    shortDesc: 'Depth-first for exploring every path, breadth-first for shortest paths, over graphs or grid cells.',
  },
  {
    id: 'backtracking',
    order: 9,
    title: 'Backtracking',
    shortDesc: 'DFS that commits to a choice, recurses, then undoes it — pruning branches that can never work.',
  },
  {
    id: 'dynamic-programming',
    order: 10,
    title: 'Dynamic Programming',
    shortDesc: 'Cache overlapping subproblem results — top-down with memoization or bottom-up with a table.',
  },
  {
    id: 'bit-manipulation',
    order: 11,
    title: 'Bit Manipulation',
    shortDesc: 'AND, OR, XOR, and shifts solve missing-number and no-arithmetic-addition problems in O(1) space.',
  },
  {
    id: 'overlapping-intervals',
    order: 12,
    title: 'Overlapping Intervals',
    shortDesc: 'Sort by start time, then merge, insert, or find conflicts among ranges in a single pass.',
  },
  {
    id: 'monotonic-stack',
    order: 13,
    title: 'Monotonic Stack',
    shortDesc: 'Keep a stack in increasing or decreasing order to find next-greater/smaller elements in O(n).',
  },
  {
    id: 'prefix-sum',
    order: 14,
    title: 'Prefix Sum',
    shortDesc: 'Precompute cumulative sums once so any range-sum query answers in O(1) instead of O(n).',
  },
];

export const getInterviewPatternById = (id: string): InterviewPattern | undefined =>
  interviewPatterns.find((p) => p.id === id);

export const getNextInterviewPattern = (id: string): InterviewPattern | undefined => {
  const idx = interviewPatterns.findIndex((p) => p.id === id);
  if (idx < 0 || idx >= interviewPatterns.length - 1) return undefined;
  return interviewPatterns[idx + 1];
};
