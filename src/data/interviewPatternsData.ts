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
    content: {
      whenToUse: [
        'Working with a linear data structure — an array, list, or string',
        'You need to scan the start and end of the input toward each other',
        'The input is sorted and you need to find a pair (or triple) satisfying some condition',
        'Removing duplicates or filtering elements in place',
      ],
      technique:
        'Instead of checking every pair with a nested loop, place one pointer i at the start and one pointer j at the end, then move them toward each other one clever step at a time based on what you see. Each pointer only ever moves inward, so the whole scan is O(n) instead of the O(n²) a double loop would cost. On a sorted array this also lets you decide which side to move by comparing against a target: move i right to increase a sum, move j left to decrease it.',
      codeTemplates: [
        {
          title: 'Two pointers converging from both ends',
          problem:
            'General shape: "scan from both ends toward the middle, comparing or accumulating as you go." Concrete case — Valid Palindrome (LeetCode 125): given a string, determine whether it reads the same forwards and backwards once non-alphanumeric characters are ignored and case is folded.',
          code:
`boolean twoPointerTemplate(int[] arr) {
    int i = 0;
    int j = arr.length - 1;

    while (i < j) {
        // process/compare the elements at i and j

        // adjust the pointers based on the problem's condition
        i++;
        // and/or j--;
    }
    return true;
}`,
        },
        {
          title: 'Worked example — Valid Palindrome',
          problem:
            'Valid Palindrome (LeetCode 125): given a string s, return true if it is a palindrome after converting all uppercase letters to lowercase and removing all non-alphanumeric characters. Skip non-alphanumeric characters from each side independently, then compare — if the pointers ever see a mismatch, it is not a palindrome.',
          code:
`boolean isPalindrome(String s) {
    int i = 0;
    int j = s.length() - 1;

    while (i < j) {
        while (i < j && !Character.isLetterOrDigit(s.charAt(i))) i++;
        while (i < j && !Character.isLetterOrDigit(s.charAt(j))) j--;

        if (Character.toLowerCase(s.charAt(i)) != Character.toLowerCase(s.charAt(j))) {
            return false;
        }
        i++;
        j--;
    }
    return true;
}`,
        },
        {
          title: 'Worked example — Container With Most Water',
          problem:
            'Container With Most Water (LeetCode 11): given n non-negative integers height[0..n-1], each representing a vertical line at that index, find two lines that together with the x-axis form a container holding the most water. Start with the widest possible container (i = 0, j = n - 1); the shorter of the two walls is always the bottleneck, so moving it — and only it — inward is the sole way a taller wall could ever produce more area.',
          code:
`int maxArea(int[] height) {
    int i = 0;
    int j = height.length - 1;
    int best = 0;

    while (i < j) {
        int width = j - i;
        int area = Math.min(height[i], height[j]) * width;
        best = Math.max(best, area);

        if (height[i] < height[j]) {
            i++;
        } else {
            j--;
        }
    }
    return best;
}`,
        },
      ],
      questions: [
        { number: 125, title: 'Valid Palindrome', url: 'https://leetcode.com/problems/valid-palindrome/' },
        { number: 15, title: '3Sum', url: 'https://leetcode.com/problems/3sum/' },
        { number: 11, title: 'Container With Most Water', url: 'https://leetcode.com/problems/container-with-most-water/' },
      ],
      vizId: 'viz-two-pointers',
    },
  },
  {
    id: 'fast-slow-pointers',
    order: 3,
    title: 'Fast & Slow Pointers',
    shortDesc: 'One pointer moves twice as fast as the other to detect cycles or find the middle of a list in O(1) space.',
    content: {
      whenToUse: [
        'Working with a linear data structure — most commonly a linked list',
        'You need to detect whether a list has a cycle',
        'You need to find the middle of a list without knowing its length in advance',
        'You want to solve it in one pass using O(1) extra space',
      ],
      technique:
        'Use two pointers that both start at the head: slow moves one node per step, fast moves two. If the list has no cycle, fast simply reaches the end first, and slow ends up on the middle node. If the list does have a cycle, fast will eventually lap it and land on the exact same node as slow — it is mathematically guaranteed to happen within one full trip around the cycle, so a plain while loop is enough; no visited-set or extra memory required. The same "move one pointer ahead, then walk both together" idea also solves problems like finding the nth-from-last node: advance one pointer n steps first, then move both at the same speed until the lead pointer runs out.',
      codeTemplates: [
        {
          title: 'Slow and fast pointers over a linked list',
          problem:
            'General shape: "advance slow by one node and fast by two nodes each iteration." With no cycle, this finds the middle of the list in O(1) space. With a cycle, slow and fast are guaranteed to land on the same node eventually — the basis of Linked List Cycle II (LeetCode 142), which additionally resets one pointer to the head after the meeting point to find where the cycle begins.',
          code:
`ListNode slowFastPointers(ListNode head) {
    ListNode slow = head;
    ListNode fast = head;

    while (fast != null && fast.next != null) {
        slow = slow.next;
        fast = fast.next.next;

        // custom logic here, e.g.:
        // if (slow == fast) { /* cycle detected */ }
    }
    return slow; // the middle node, when there is no cycle
}`,
        },
        {
          title: 'Worked example — Linked List Cycle',
          problem:
            'Linked List Cycle (LeetCode 141): given the head of a linked list, determine if it has a cycle. Move slow one step and fast two steps per iteration; if a cycle exists, fast is guaranteed to lap the list and land exactly on slow. If fast (or fast.next) reaches null first, there is no cycle.',
          code:
`boolean hasCycle(ListNode head) {
    ListNode slow = head;
    ListNode fast = head;

    while (fast != null && fast.next != null) {
        slow = slow.next;
        fast = fast.next.next;
        if (slow == fast) {
            return true;
        }
    }
    return false;
}`,
        },
        {
          title: 'Worked example — Remove Nth Node From End of List',
          problem:
            'Remove Nth Node From End of List (LeetCode 19): given the head of a list, remove the nth node from the end and return the new head. Rather than first counting the list\'s length, advance a fast pointer n steps ahead of a slow pointer, then move both together one step at a time; when fast falls off the end, slow is sitting exactly one node before the one that needs to be removed.',
          code:
`ListNode removeNthFromEnd(ListNode head, int n) {
    ListNode dummy = new ListNode(0, head);
    ListNode fast = dummy;
    ListNode slow = dummy;

    for (int i = 0; i < n; i++) {
        fast = fast.next;
    }

    while (fast.next != null) {
        fast = fast.next;
        slow = slow.next;
    }

    slow.next = slow.next.next;
    return dummy.next;
}`,
        },
      ],
      questions: [
        { number: 141, title: 'Linked List Cycle', url: 'https://leetcode.com/problems/linked-list-cycle/' },
        { number: 142, title: 'Linked List Cycle II', url: 'https://leetcode.com/problems/linked-list-cycle-ii/' },
        { number: 19, title: 'Remove Nth Node From End of List', url: 'https://leetcode.com/problems/remove-nth-node-from-end-of-list/' },
      ],
      vizId: 'viz-fast-slow-pointers',
    },
  },
  {
    id: 'linked-list-reversal',
    order: 4,
    title: 'In-Place Linked List Reversal',
    shortDesc: 'Rewire next pointers as you walk the list to reverse it in one pass with no extra space.',
    content: {
      whenToUse: [
        'Reversing a linked list in one pass with O(1) extra space',
        'Reversing only a specific portion of a linked list',
        'Reversing nodes in fixed-size groups of k',
      ],
      technique:
        'Walk the list with two pointers, prev and curr, both starting from before the head. At each node, save curr.next before you overwrite it (or you will lose the rest of the list), then rewire curr.next to point back at prev instead of forward. Then slide both pointers one step along: prev becomes curr, and curr becomes the node you saved. When curr runs off the end, prev is sitting on the new head. Because you only ever touch three pointers per step, the whole list reverses in a single O(n) pass with no extra array or recursion stack — and the same rewiring move composes: run it on a bounded range for a partial reversal, or repeatedly on fixed-size chunks for a k-group reversal.',
      codeTemplates: [
        {
          title: 'In-place reversal of a linked list',
          problem:
            'Reverse Linked List (LeetCode 206): given the head of a singly linked list, reverse it and return the new head. Track prev and curr as you walk forward, and just before advancing, rewire curr.next back to point at prev. Once curr becomes null, prev is the new head.',
          code:
`ListNode reverseList(ListNode head) {
    ListNode prev = null;
    ListNode curr = head;

    while (curr != null) {
        ListNode next = curr.next;
        curr.next = prev;
        prev = curr;
        curr = next;
    }
    return prev; // new head of the reversed list
}`,
        },
        {
          title: 'Worked example — Reverse Nodes in k-Group',
          problem:
            'Reverse Nodes in k-Group (LeetCode 25): given the head of a list, reverse the nodes k at a time and return the new head; if the number of remaining nodes is not a multiple of k, leave that final group as-is. This recursive version reverses the next group first, then applies the exact same prev/curr rewiring loop to the current k nodes, using the already-reversed remainder as the starting value of prev.',
          code:
`ListNode reverseKGroup(ListNode head, int k) {
    ListNode node = head;
    for (int i = 0; i < k; i++) {
        if (node == null) return head; // fewer than k nodes left — leave as-is
        node = node.next;
    }

    ListNode prev = reverseKGroup(node, k); // reverse the remaining groups first
    ListNode curr = head;
    for (int i = 0; i < k; i++) {
        ListNode next = curr.next;
        curr.next = prev;
        prev = curr;
        curr = next;
    }
    return prev;
}`,
        },
        {
          title: 'Worked example — Reorder List',
          problem:
            'Reorder List (LeetCode 143): given a list L0 → L1 → … → Ln, reorder it in place to L0 → Ln → L1 → Ln-1 → L2 → …. Three patterns compose to solve it: find the middle with fast & slow pointers, reverse the second half in place with this pattern\'s technique, then merge the two halves by alternating nodes from each.',
          code:
`void reorderList(ListNode head) {
    // 1. find the middle
    ListNode slow = head, fast = head;
    while (fast != null && fast.next != null) {
        slow = slow.next;
        fast = fast.next.next;
    }

    // 2. reverse the second half in place
    ListNode prev = null, curr = slow.next;
    slow.next = null;
    while (curr != null) {
        ListNode next = curr.next;
        curr.next = prev;
        prev = curr;
        curr = next;
    }

    // 3. merge the two halves alternately
    ListNode first = head, second = prev;
    while (second != null) {
        ListNode tmp1 = first.next;
        ListNode tmp2 = second.next;
        first.next = second;
        second.next = tmp1;
        first = tmp1;
        second = tmp2;
    }
}`,
        },
      ],
      questions: [
        { number: 206, title: 'Reverse Linked List', url: 'https://leetcode.com/problems/reverse-linked-list/' },
        { number: 143, title: 'Reorder List', url: 'https://leetcode.com/problems/reorder-list/' },
        { number: 25, title: 'Reverse Nodes in k-Group', url: 'https://leetcode.com/problems/reverse-nodes-in-k-group/' },
      ],
      vizId: 'viz-linked-list-reversal',
    },
  },
  {
    id: 'binary-search',
    order: 5,
    title: 'Binary Search',
    shortDesc: 'Halve the search space each step to find a target — or a boundary — in sorted or rotated arrays.',
    content: {
      whenToUse: [
        'The input is sorted and you need to find a number, or determine that it is absent',
        'Finding the leftmost or rightmost position of a value, or the position to insert one',
        'Handling duplicates in a sorted array',
        'Searching in a rotated sorted array',
      ],
      technique:
        'Keep left and right pointers spanning the search space, look at the midpoint, and use one comparison to throw away half the remaining space every iteration — turning an O(n) scan into O(log n). The classic version compares arr[mid] to a target directly, but the more general and more useful version bisects on a boolean condition: find the smallest index where condition(index) flips from false to true. Every "find the boundary of X" problem is this same template with a different condition function — find the first index ≥ target, the first index > target, the first index where a rotated array stops being sorted, and so on.',
      variants: [
        {
          title: 'Classic search',
          description: 'Compare arr[mid] to target directly: equal returns mid, less moves left up, greater moves right down. Finds an exact match.',
        },
        {
          title: 'Boundary search (bisection)',
          description: 'Search on a monotonic condition(mid) instead of equality — returns the first index where the condition holds. The same template powers first/last occurrence, insertion position, and more.',
        },
        {
          title: 'Rotated array search',
          description: 'A sorted array rotated at an unknown pivot still has one sorted half around every midpoint. Check which half is sorted, then check whether the target falls inside that half\'s range to decide which side to keep.',
        },
      ],
      codeTemplates: [
        {
          title: 'Boundary search — first index where a condition holds',
          problem:
            'General shape: instead of only checking arr[mid] == target, find the smallest index where some boolean condition first becomes true, given the array is monotonic with respect to that condition (all false, then all true). This single template is the basis of Find First and Last Position of Element in Sorted Array (LeetCode 34): call it once with "arr[mid] >= target" for the first occurrence, and once with "arr[mid] > target" for one past the last occurrence.',
          code:
`int binarySearch(int[] arr, IntPredicate condition) {
    int left = 0, right = arr.length;

    while (left < right) {
        int mid = left + (right - left) / 2;
        if (condition.test(mid)) {
            right = mid;
        } else {
            left = mid + 1;
        }
    }
    return left; // first index where condition(index) is true
}`,
        },
        {
          title: 'Worked example — Find First and Last Position of Element in Sorted Array',
          problem:
            'Find First and Last Position of Element in Sorted Array (LeetCode 34): given a sorted array that may contain duplicates, find the first and last index of a target value in O(log n), or [-1, -1] if it is absent. Reuse the boundary-search template twice: once to find the first index ≥ target, once to find the first index ≥ target + 1 (one past the last occurrence).',
          code:
`int[] searchRange(int[] nums, int target) {
    int left = lowerBound(nums, target);
    if (left == nums.length || nums[left] != target) {
        return new int[]{-1, -1};
    }
    int right = lowerBound(nums, target + 1) - 1;
    return new int[]{left, right};
}

private int lowerBound(int[] nums, int target) {
    int left = 0, right = nums.length;
    while (left < right) {
        int mid = left + (right - left) / 2;
        if (nums[mid] >= target) {
            right = mid;
        } else {
            left = mid + 1;
        }
    }
    return left;
}`,
        },
        {
          title: 'Worked example — Find Minimum in Rotated Sorted Array',
          problem:
            'Find Minimum in Rotated Sorted Array (LeetCode 153): a sorted array with no duplicates was rotated at some unknown pivot; find its minimum element in O(log n). Compare nums[mid] to nums[right]: if nums[mid] is bigger, the rotation point — and the minimum — must be to the right of mid; otherwise it is at mid or further left. This converges on the rotation point in log n steps.',
          code:
`int findMin(int[] nums) {
    int left = 0, right = nums.length - 1;

    while (left < right) {
        int mid = left + (right - left) / 2;
        if (nums[mid] > nums[right]) {
            left = mid + 1;
        } else {
            right = mid;
        }
    }
    return nums[left];
}`,
        },
        {
          title: 'Worked example — Search in Rotated Sorted Array',
          problem:
            'Search in Rotated Sorted Array (LeetCode 33): given a rotated sorted array with no duplicates, find the index of target in O(log n), or -1. At every midpoint, one of the two halves [left, mid] or [mid, right] is guaranteed to be normally sorted; check whether target falls inside that sorted half\'s value range to decide which half to keep searching.',
          code:
`int search(int[] nums, int target) {
    int left = 0, right = nums.length - 1;

    while (left <= right) {
        int mid = left + (right - left) / 2;
        if (nums[mid] == target) return mid;

        if (nums[left] <= nums[mid]) { // left half is sorted
            if (nums[left] <= target && target < nums[mid]) {
                right = mid - 1;
            } else {
                left = mid + 1;
            }
        } else { // right half is sorted
            if (nums[mid] < target && target <= nums[right]) {
                left = mid + 1;
            } else {
                right = mid - 1;
            }
        }
    }
    return -1;
}`,
        },
      ],
      questions: [
        { number: 34, title: 'Find First and Last Position of Element in Sorted Array', url: 'https://leetcode.com/problems/find-first-and-last-position-of-element-in-sorted-array/' },
        { number: 153, title: 'Find Minimum in Rotated Sorted Array', url: 'https://leetcode.com/problems/find-minimum-in-rotated-sorted-array/' },
        { number: 33, title: 'Search in Rotated Sorted Array', url: 'https://leetcode.com/problems/search-in-rotated-sorted-array/' },
      ],
      vizId: 'viz-binary-search',
    },
  },
  {
    id: 'top-k-elements',
    order: 6,
    title: 'Top K Elements',
    shortDesc: 'A size-K heap finds the k largest/smallest/most-frequent elements in O(n log k), no full sort needed.',
    content: {
      whenToUse: [
        'Finding the k largest or k smallest elements in a collection',
        'Finding the kth largest or kth smallest element specifically',
        'Finding the k most (or least) frequent elements',
      ],
      technique:
        'Sorting everything first and taking the top k works, but costs O(n log n). A heap does better: push and pop cost only O(log k) when the heap never grows past size k, so scanning n elements costs O(n log k) overall — noticeably cheaper than a full sort once k is much smaller than n. To find the k largest elements, counter-intuitively use a MIN-heap of size k: push every element, and whenever the heap grows past k, pop the minimum. Whatever survives is always the k largest seen so far, because the smallest of the current candidates is exactly what gets evicted the moment a fuller set exists. Symmetrically, use a MAX-heap of size k to find the k smallest.',
      codeTemplates: [
        {
          title: 'Top K largest elements via a size-k min-heap',
          problem:
            'General shape: maintain a min-heap capped at size k while scanning. Push every element; once the heap exceeds k, pop the minimum. The heap always holds exactly the k largest elements seen so far, and its root is the smallest of them — i.e. the kth largest overall once the whole input has been scanned.',
          code:
`int[] topKLargest(int[] arr, int k) {
    PriorityQueue<Integer> minHeap = new PriorityQueue<>();
    for (int num : arr) {
        minHeap.offer(num);
        if (minHeap.size() > k) {
            minHeap.poll();
        }
    }

    int[] result = new int[k];
    for (int i = k - 1; i >= 0; i--) {
        result[i] = minHeap.poll();
    }
    return result;
}`,
        },
        {
          title: 'Worked example — Kth Largest Element in an Array',
          problem:
            'Kth Largest Element in an Array (LeetCode 215): given an unsorted array, find the kth largest element. Maintain a min-heap capped at size k; after scanning every element, the heap\'s root — its current minimum — is exactly the kth largest value in the whole array.',
          code:
`int findKthLargest(int[] nums, int k) {
    PriorityQueue<Integer> minHeap = new PriorityQueue<>();
    for (int num : nums) {
        minHeap.offer(num);
        if (minHeap.size() > k) {
            minHeap.poll();
        }
    }
    return minHeap.peek();
}`,
        },
        {
          title: 'Worked example — Top K Frequent Elements',
          problem:
            'Top K Frequent Elements (LeetCode 347): given an array, return its k most frequent elements. Count occurrences with a hashmap, then run the exact same size-k min-heap trick — only this time the heap orders candidates by frequency instead of by value.',
          code:
`int[] topKFrequent(int[] nums, int k) {
    Map<Integer, Integer> freq = new HashMap<>();
    for (int num : nums) {
        freq.merge(num, 1, Integer::sum);
    }

    PriorityQueue<Integer> minHeap = new PriorityQueue<>(
        (a, b) -> freq.get(a) - freq.get(b)
    );
    for (int num : freq.keySet()) {
        minHeap.offer(num);
        if (minHeap.size() > k) {
            minHeap.poll();
        }
    }

    int[] result = new int[k];
    for (int i = k - 1; i >= 0; i--) {
        result[i] = minHeap.poll();
    }
    return result;
}`,
        },
        {
          title: 'Worked example — Merge k Sorted Lists',
          problem:
            'Merge k Sorted Lists (LeetCode 23): merge k sorted linked lists into a single sorted list. Keep a min-heap holding the current head of each list (at most k nodes at a time); repeatedly pop the smallest, append it to the output, and push its successor back in. That is an O(N log k) merge instead of scanning all k heads by hand at every step.',
          code:
`ListNode mergeKLists(ListNode[] lists) {
    PriorityQueue<ListNode> minHeap = new PriorityQueue<>(
        (a, b) -> a.val - b.val
    );
    for (ListNode node : lists) {
        if (node != null) minHeap.offer(node);
    }

    ListNode dummy = new ListNode(0);
    ListNode tail = dummy;
    while (!minHeap.isEmpty()) {
        ListNode smallest = minHeap.poll();
        tail.next = smallest;
        tail = tail.next;
        if (smallest.next != null) {
            minHeap.offer(smallest.next);
        }
    }
    return dummy.next;
}`,
        },
      ],
      questions: [
        { number: 215, title: 'Kth Largest Element in an Array', url: 'https://leetcode.com/problems/kth-largest-element-in-an-array/' },
        { number: 347, title: 'Top K Frequent Elements', url: 'https://leetcode.com/problems/top-k-frequent-elements/' },
        { number: 23, title: 'Merge k Sorted Lists', url: 'https://leetcode.com/problems/merge-k-sorted-lists/' },
      ],
      vizId: 'viz-top-k-elements',
    },
  },
  {
    id: 'tree-traversal',
    order: 7,
    title: 'Binary Tree Traversal',
    shortDesc: 'Preorder, inorder, postorder, and level-order — the four ways to visit every node in a tree.',
    content: {
      whenToUse: [
        'Preorder: serializing a tree, or rebuilding one from a serialized form',
        'Inorder: reading the values of a binary search tree out in sorted order',
        'Postorder: any computation that needs both children\'s results before it can compute its own (bottom-up)',
        'Level-order (BFS): scanning or processing a tree level by level',
      ],
      technique:
        'The three depth-first orders — preorder, inorder, postorder — are the exact same recursive skeleton with the "visit this node" line moved to a different spot relative to the two recursive calls: before both (preorder), between them (inorder), or after both (postorder). Where you place that line determines what you get: preorder always outputs a subtree\'s root before its children, which is exactly what you need to reconstruct the tree later; postorder always finishes both children first, which is exactly what you need for any bottom-up computation like a node\'s depth or a subtree sum. Level-order breaks from recursion entirely — you can\'t peek "one level down" with a stack, so you use a queue instead, processing nodes in the order they were discovered rather than the order you\'d reach them by diving deep first.',
      codeTemplates: [
        {
          title: 'Preorder traversal — node, then left, then right',
          problem:
            'General shape: visit the node before either subtree. Used to serialize a tree (a root always appears before its children in the output) and to reconstruct one — Construct Binary Tree from Preorder and Inorder Traversal (LeetCode 105) relies on the fact that a preorder sequence\'s first element is always the current subtree\'s root.',
          code:
`void preorderTraversal(TreeNode node, List<Integer> result) {
    if (node == null) return;
    result.add(node.val); // visit node
    preorderTraversal(node.left, result);
    preorderTraversal(node.right, result);
}`,
        },
        {
          title: 'Inorder traversal — left, then node, then right',
          problem:
            'General shape: visit the left subtree, then the node, then the right subtree. For a binary search tree specifically, this always produces the values in sorted order — which is why inorder is the standard way to validate a BST or flatten one back into a sorted list, and why it pairs with preorder in LeetCode 105 to pin down each subtree\'s exact boundaries.',
          code:
`void inorderTraversal(TreeNode node, List<Integer> result) {
    if (node == null) return;
    inorderTraversal(node.left, result);
    result.add(node.val); // visit node
    inorderTraversal(node.right, result);
}`,
        },
        {
          title: 'Worked example — Maximum Depth of Binary Tree (postorder)',
          problem:
            'Maximum Depth of Binary Tree (LeetCode 104): find the number of nodes along the longest path from the root down to a leaf. This is naturally postorder: you need both children\'s depths before you can compute your own, so the combining step happens last, after both recursive calls return.',
          code:
`int maxDepth(TreeNode node) {
    if (node == null) return 0;
    int leftDepth = maxDepth(node.left);
    int rightDepth = maxDepth(node.right);
    return 1 + Math.max(leftDepth, rightDepth); // visit node last
}`,
        },
        {
          title: 'Worked example — Binary Tree Level Order Traversal (BFS)',
          problem:
            'Binary Tree Level Order Traversal (LeetCode 102): return the node values grouped level by level. Use a queue instead of recursion: at the start of each round the queue holds exactly the nodes of one level — record that count first, then pop exactly that many nodes while pushing their children for the next round.',
          code:
`List<List<Integer>> levelOrder(TreeNode root) {
    List<List<Integer>> levels = new ArrayList<>();
    if (root == null) return levels;

    Queue<TreeNode> queue = new LinkedList<>();
    queue.offer(root);

    while (!queue.isEmpty()) {
        int levelSize = queue.size();
        List<Integer> level = new ArrayList<>();
        for (int i = 0; i < levelSize; i++) {
            TreeNode node = queue.poll();
            level.add(node.val);
            if (node.left != null) queue.offer(node.left);
            if (node.right != null) queue.offer(node.right);
        }
        levels.add(level);
    }
    return levels;
}`,
        },
      ],
      questions: [
        { number: 104, title: 'Maximum Depth of Binary Tree', url: 'https://leetcode.com/problems/maximum-depth-of-binary-tree/' },
        { number: 102, title: 'Binary Tree Level Order Traversal', url: 'https://leetcode.com/problems/binary-tree-level-order-traversal/' },
        { number: 105, title: 'Construct Binary Tree from Preorder and Inorder Traversal', url: 'https://leetcode.com/problems/construct-binary-tree-from-preorder-and-inorder-traversal/' },
        { number: 124, title: 'Binary Tree Maximum Path Sum', url: 'https://leetcode.com/problems/binary-tree-maximum-path-sum/' },
      ],
      vizId: 'viz-tree-traversal',
    },
  },
  {
    id: 'graphs-matrices',
    order: 8,
    title: 'Graphs & Matrices (BFS/DFS)',
    shortDesc: 'Depth-first for exploring every path, breadth-first for shortest paths, over graphs or grid cells.',
    content: {
      whenToUse: [
        'Searching a graph or a grid/matrix of cells',
        'DFS: exploring every possible path, such as tracing a word through a maze',
        'BFS: finding the shortest path, or the minimum time for something to spread',
        'Topological Sort: ordering tasks based on dependencies between them',
      ],
      technique:
        'DFS dives as deep as possible down one branch before backtracking, using recursion (or an explicit stack) plus a visited set so you never process the same node twice. BFS instead explores every neighbor of the current layer before moving one layer further out, using a queue — which is exactly why it finds shortest paths: the first time BFS reaches a node is guaranteed to be via the fewest possible steps. In a graph, "neighbors" come from an adjacency list; in a matrix, they are usually the up/down/left/right cells (sometimes diagonals too). Topological sort is DFS with a twist — track whether each node is unvisited, in-progress, or done, and a back edge into an in-progress node means the graph has a cycle and no valid ordering exists.',
      codeTemplates: [
        {
          title: 'BFS over a grid',
          problem:
            'General shape: explore a grid outward one ring of neighbors at a time using a queue, marking cells visited the moment they are enqueued so the same cell is never queued twice. Because it expands level by level, BFS is the standard choice whenever you need the shortest number of steps from a source — or, as in Rotting Oranges (LeetCode 994), the minimum time for something to spread across a grid from several starting points at once.',
          code:
`List<int[]> bfsMatrix(int[][] grid, int startRow, int startCol) {
    int rows = grid.length, cols = grid[0].length;
    boolean[][] visited = new boolean[rows][cols];
    int[][] directions = {{-1,0},{1,0},{0,-1},{0,1}};

    List<int[]> order = new ArrayList<>();
    Queue<int[]> queue = new LinkedList<>();
    queue.offer(new int[]{startRow, startCol});
    visited[startRow][startCol] = true;

    while (!queue.isEmpty()) {
        int[] cell = queue.poll();
        order.add(cell); // process the cell

        for (int[] d : directions) {
            int r = cell[0] + d[0], c = cell[1] + d[1];
            if (r >= 0 && r < rows && c >= 0 && c < cols && !visited[r][c]) {
                visited[r][c] = true;
                queue.offer(new int[]{r, c});
            }
        }
    }
    return order;
}`,
        },
        {
          title: 'DFS over a grid',
          problem:
            'General shape: dive as deep as possible down one path before backtracking, marking cells visited so you never revisit them. This is the natural fit whenever you need to explore or verify an entire path through a grid — tracing a word out letter by letter in Word Search (LeetCode 79), or flood-filling every cell reachable from a coastline in Pacific Atlantic Water Flow (LeetCode 417).',
          code:
`boolean[][] visited;

void dfsMatrix(char[][] grid, int row, int col, List<int[]> path) {
    int rows = grid.length, cols = grid[0].length;
    if (row < 0 || row >= rows || col < 0 || col >= cols || visited[row][col]) {
        return;
    }
    visited[row][col] = true;
    path.add(new int[]{row, col}); // process the cell

    dfsMatrix(grid, row - 1, col, path);
    dfsMatrix(grid, row + 1, col, path);
    dfsMatrix(grid, row, col - 1, path);
    dfsMatrix(grid, row, col + 1, path);
}`,
        },
        {
          title: 'Worked example — Rotting Oranges (multi-source BFS)',
          problem:
            'Rotting Oranges (LeetCode 994): a grid contains fresh oranges (1), rotten oranges (2), and empty cells (0). Every minute, every rotten orange rots its fresh neighbors. Find the minimum minutes until no fresh orange remains, or -1 if some can never rot. This is BFS with every rotten orange as a starting source simultaneously — process the grid one full "minute" (one queue level) at a time.',
          code:
`int orangesRotting(int[][] grid) {
    int rows = grid.length, cols = grid[0].length;
    Queue<int[]> queue = new LinkedList<>();
    int fresh = 0;

    for (int r = 0; r < rows; r++) {
        for (int c = 0; c < cols; c++) {
            if (grid[r][c] == 2) queue.offer(new int[]{r, c});
            else if (grid[r][c] == 1) fresh++;
        }
    }

    int minutes = 0;
    int[][] directions = {{-1,0},{1,0},{0,-1},{0,1}};
    while (!queue.isEmpty() && fresh > 0) {
        int size = queue.size();
        for (int i = 0; i < size; i++) {
            int[] cell = queue.poll();
            for (int[] d : directions) {
                int r = cell[0] + d[0], c = cell[1] + d[1];
                if (r >= 0 && r < rows && c >= 0 && c < cols && grid[r][c] == 1) {
                    grid[r][c] = 2;
                    fresh--;
                    queue.offer(new int[]{r, c});
                }
            }
        }
        minutes++;
    }
    return fresh == 0 ? minutes : -1;
}`,
        },
        {
          title: 'Worked example — Course Schedule (topological sort)',
          problem:
            'Course Schedule (LeetCode 207): given numCourses and a list of prerequisite pairs, determine whether it is possible to finish all courses — i.e. whether the prerequisite graph is acyclic. DFS each course, marking it "in progress" while its neighbors are still being explored; reaching a neighbor that is already "in progress" is a back edge, meaning a cycle exists and no valid course order can ever finish.',
          code:
`boolean canFinish(int numCourses, int[][] prerequisites) {
    List<List<Integer>> graph = new ArrayList<>();
    for (int i = 0; i < numCourses; i++) graph.add(new ArrayList<>());
    for (int[] p : prerequisites) graph.get(p[1]).add(p[0]);

    int[] state = new int[numCourses]; // 0 = unvisited, 1 = in progress, 2 = done

    for (int course = 0; course < numCourses; course++) {
        if (state[course] == 0 && hasCycle(course, graph, state)) {
            return false;
        }
    }
    return true;
}

private boolean hasCycle(int course, List<List<Integer>> graph, int[] state) {
    state[course] = 1;
    for (int next : graph.get(course)) {
        if (state[next] == 1) return true; // back edge -> cycle
        if (state[next] == 0 && hasCycle(next, graph, state)) return true;
    }
    state[course] = 2;
    return false;
}`,
        },
      ],
      questions: [
        { number: 79, title: 'Word Search', url: 'https://leetcode.com/problems/word-search/' },
        { number: 207, title: 'Course Schedule', url: 'https://leetcode.com/problems/course-schedule/' },
        { number: 994, title: 'Rotting Oranges', url: 'https://leetcode.com/problems/rotting-oranges/' },
        { number: 417, title: 'Pacific Atlantic Water Flow', url: 'https://leetcode.com/problems/pacific-atlantic-water-flow/' },
        { number: 127, title: 'Word Ladder', url: 'https://leetcode.com/problems/word-ladder/' },
      ],
      vizId: 'viz-graphs-matrices',
    },
  },
  {
    id: 'backtracking',
    order: 9,
    title: 'Backtracking',
    shortDesc: 'DFS that commits to a choice, recurses, then undoes it — pruning branches that can never work.',
    content: {
      whenToUse: [
        'Combinatorial problems — combinations, permutations, subsets',
        'Constraint satisfaction problems — Sudoku, N-Queens',
        'Whenever you can prune a branch early using a constraint, instead of generating every possibility and filtering afterward',
      ],
      technique:
        'Backtracking is DFS with one extra discipline: after you recurse into a choice, you undo it before trying the next one, so no leftover state ever leaks into a sibling branch. The loop is always the same three steps — choose a candidate, explore by recursing, then un-choose it — and it is exactly that "un-choose" step that makes the same path array or board safely reusable across the entire search instead of allocating a fresh copy at every node. The other half of backtracking is pruning: check a constraint before committing to a choice, and skip it immediately if it can never lead anywhere valid, instead of paying the cost of exploring — and later discarding — a doomed branch.',
      codeTemplates: [
        {
          title: 'Generic backtracking template',
          problem:
            'General shape: build a partial solution one choice at a time. The moment a partial path is complete, record it; otherwise try every valid next candidate, recurse, and undo the choice before moving to the next one. That choose → explore → un-choose loop is what lets backtracking reuse a single mutable path/board across the whole search instead of copying it at every node.',
          code:
`void backtrack(List<Integer> candidates, List<Integer> path) {
    if (isSolution(path)) {
        processSolution(path);
        return;
    }

    for (int candidate : candidates) {
        if (isValid(candidate, path)) {
            path.add(candidate);          // choose
            backtrack(candidates, path);  // explore
            path.remove(path.size() - 1); // un-choose
        }
    }
}`,
        },
        {
          title: 'Worked example — Subsets',
          problem:
            'Subsets (LeetCode 78): given an array of distinct integers, return every possible subset (the power set). Every node visited during the recursion is itself a valid subset — not just the leaves — so the result is recorded at the top of each call, before the loop even starts. Starting the inner loop at i + 1 stops an element from being reused and keeps every subset from being generated more than once.',
          code:
`List<List<Integer>> subsets(int[] nums) {
    List<List<Integer>> result = new ArrayList<>();
    backtrack(nums, 0, new ArrayList<>(), result);
    return result;
}

private void backtrack(int[] nums, int start, List<Integer> path, List<List<Integer>> result) {
    result.add(new ArrayList<>(path)); // every partial path is a valid subset

    for (int i = start; i < nums.length; i++) {
        path.add(nums[i]);
        backtrack(nums, i + 1, path, result);
        path.remove(path.size() - 1);
    }
}`,
        },
        {
          title: 'Worked example — Permutations',
          problem:
            'Permutations (LeetCode 46): given an array of distinct integers, return every possible ordering. Unlike Subsets, order matters and every element must eventually appear, so a path only counts as a solution once its length equals nums.length; a used[] array is the constraint that stops the same element being picked twice within one permutation.',
          code:
`List<List<Integer>> permute(int[] nums) {
    List<List<Integer>> result = new ArrayList<>();
    backtrack(nums, new ArrayList<>(), new boolean[nums.length], result);
    return result;
}

private void backtrack(int[] nums, List<Integer> path, boolean[] used, List<List<Integer>> result) {
    if (path.size() == nums.length) {
        result.add(new ArrayList<>(path));
        return;
    }

    for (int i = 0; i < nums.length; i++) {
        if (used[i]) continue;
        used[i] = true;
        path.add(nums[i]);
        backtrack(nums, path, used, result);
        path.remove(path.size() - 1);
        used[i] = false;
    }
}`,
        },
        {
          title: 'Worked example — N-Queens',
          problem:
            'N-Queens (LeetCode 51): place n queens on an n×n board so no two attack each other, and return every valid arrangement. isSafe is the pruning constraint: the instant a column choice shares a column or diagonal with any queen already placed in an earlier row, that entire branch is skipped instead of being explored down to a guaranteed dead end.',
          code:
`List<List<String>> solveNQueens(int n) {
    List<List<String>> result = new ArrayList<>();
    int[] queenCol = new int[n]; // queenCol[row] = column of the queen on that row
    backtrack(0, n, queenCol, result);
    return result;
}

private void backtrack(int row, int n, int[] queenCol, List<List<String>> result) {
    if (row == n) {
        result.add(buildBoard(queenCol, n));
        return;
    }

    for (int col = 0; col < n; col++) {
        if (isSafe(queenCol, row, col)) {
            queenCol[row] = col;                     // choose
            backtrack(row + 1, n, queenCol, result); // explore
            // no explicit un-choose needed — the next iteration overwrites queenCol[row]
        }
    }
}

private boolean isSafe(int[] queenCol, int row, int col) {
    for (int r = 0; r < row; r++) {
        int c = queenCol[r];
        if (c == col || Math.abs(c - col) == row - r) return false; // same column or diagonal
    }
    return true;
}`,
        },
      ],
      questions: [
        { number: 78, title: 'Subsets', url: 'https://leetcode.com/problems/subsets/' },
        { number: 46, title: 'Permutations', url: 'https://leetcode.com/problems/permutations/' },
        { number: 39, title: 'Combination Sum', url: 'https://leetcode.com/problems/combination-sum/' },
        { number: 37, title: 'Sudoku Solver', url: 'https://leetcode.com/problems/sudoku-solver/' },
        { number: 51, title: 'N-Queens', url: 'https://leetcode.com/problems/n-queens/' },
      ],
      vizId: 'viz-backtracking',
    },
  },
  {
    id: 'dynamic-programming',
    order: 10,
    title: 'Dynamic Programming',
    shortDesc: 'Cache overlapping subproblem results — top-down with memoization or bottom-up with a table.',
    content: {
      whenToUse: [
        'The problem has overlapping subproblems and optimal substructure',
        'Optimization problems — minimum/maximum distance, cost, or profit',
        'Sequence problems — e.g. the longest increasing subsequence',
        'Combinatorial "count the number of ways" problems',
        'Reducing a naive exponential-time recursion down to polynomial time',
      ],
      technique:
        'Dynamic programming applies whenever a problem\'s solution depends on the solutions to smaller versions of itself, and those smaller subproblems repeat. The fix is always the same idea: cache each subproblem\'s answer the first time you compute it, so later requests for it are instant instead of triggering the same recursion all over again. There are two ways to apply that cache. Top-down keeps the natural recursive structure and adds a memo (a hashmap or array) that returns immediately when a subproblem has already been solved. Bottom-up flips the direction entirely — start from the base cases and iterate forward, filling in a table (or, when each answer only depends on the last one or two entries, just a couple of rolling variables) until you reach the final answer. Bottom-up is usually preferred when it applies, since it avoids recursion overhead and often needs much less memory.',
      codeTemplates: [
        {
          title: 'Top-down with memoization',
          problem:
            'General shape: keep the natural recursive definition, but cache every result the first time you compute it. Without a cache, a recurrence like Fibonacci costs O(2ⁿ) because the same subproblems get recomputed exponentially many times; a hashmap that remembers each answer brings that straight down to O(n) — you start with the full problem and let the recursion split it into subproblems exactly as you would write it on paper.',
          code:
`Map<Integer, Long> memo = new HashMap<>();

long fibTopDown(int n) {
    if (memo.containsKey(n)) return memo.get(n);
    if (n <= 1) return n;

    long result = fibTopDown(n - 1) + fibTopDown(n - 2);
    memo.put(n, result);
    return result;
}`,
        },
        {
          title: 'Bottom-up with O(1) space',
          problem:
            'General shape: start from the base cases and iterate forward instead of recursing down to them. Because this recurrence only ever needs the previous two values, a full array is not required — two rolling variables carry everything forward, cutting the space from O(n) down to O(1).',
          code:
`int fibBottomUp(int n) {
    if (n <= 1) return n;
    int prev2 = 0, prev1 = 1;

    for (int i = 2; i <= n; i++) {
        int curr = prev2 + prev1;
        prev2 = prev1;
        prev1 = curr;
    }
    return prev1;
}`,
        },
        {
          title: 'Worked example — Climbing Stairs',
          problem:
            'Climbing Stairs (LeetCode 70): you can climb 1 or 2 steps at a time; count the distinct ways to reach the top of an n-step staircase. The number of ways to reach step i is exactly the ways to reach step i-1 plus the ways to reach step i-2 — arrive via a final 1-step or a final 2-step move — which is the Fibonacci recurrence wearing a different hat.',
          code:
`int climbStairs(int n) {
    if (n <= 2) return n;
    int oneStepBack = 2, twoStepsBack = 1;

    for (int i = 3; i <= n; i++) {
        int curr = oneStepBack + twoStepsBack;
        twoStepsBack = oneStepBack;
        oneStepBack = curr;
    }
    return oneStepBack;
}`,
        },
        {
          title: 'Worked example — Coin Change',
          problem:
            'Coin Change (LeetCode 322): given coin denominations and a target amount, find the fewest coins that make that amount, or -1 if it is impossible. dp[a] holds the best answer for amount a; build it up from dp[0] = 0 by trying every coin as the "last coin used" — dp[a] = 1 + dp[a - coin], minimised over every coin. Unlike the Fibonacci-shaped examples, each entry here depends on trying every available choice, not just the last one or two.',
          code:
`int coinChange(int[] coins, int amount) {
    int[] dp = new int[amount + 1];
    Arrays.fill(dp, amount + 1); // amount + 1 acts as "infinity"
    dp[0] = 0;

    for (int a = 1; a <= amount; a++) {
        for (int coin : coins) {
            if (coin <= a) {
                dp[a] = Math.min(dp[a], dp[a - coin] + 1);
            }
        }
    }
    return dp[amount] > amount ? -1 : dp[amount];
}`,
        },
      ],
      questions: [
        { number: 70, title: 'Climbing Stairs', url: 'https://leetcode.com/problems/climbing-stairs/' },
        { number: 322, title: 'Coin Change', url: 'https://leetcode.com/problems/coin-change/' },
        { number: 1143, title: 'Longest Common Subsequence', url: 'https://leetcode.com/problems/longest-common-subsequence/' },
        { number: 300, title: 'Longest Increasing Subsequence', url: 'https://leetcode.com/problems/longest-increasing-subsequence/' },
        { number: 72, title: 'Edit Distance', url: 'https://leetcode.com/problems/edit-distance/' },
      ],
      vizId: 'viz-dynamic-programming',
    },
  },
  {
    id: 'bit-manipulation',
    order: 11,
    title: 'Bit Manipulation',
    shortDesc: 'AND, OR, XOR, and shifts solve missing-number and no-arithmetic-addition problems in O(1) space.',
    content: {
      whenToUse: [
        'Counting the number of 0 or 1 bits in a number',
        'Adding two numbers without using the + or - operators',
        'Finding a missing or unpaired number in a list',
      ],
      technique:
        'Most bit-manipulation questions lean on the same small handful of operators — AND, OR, NOT, XOR, and the shifts — combined in a clever way rather than anything conceptually deep. XOR is the one with the most interview mileage: x ^ x = 0 and x ^ 0 = x, so XOR-ing a value with itself always cancels it out. That single fact is what lets you find a missing or unpaired number in O(1) extra space (every paired-up value cancels, leaving only the odd one out), and combined with AND and a left shift, it is also enough to add two integers together without ever touching + or -. These questions are worth knowing but relatively rare in interviews, so it is more valuable to be comfortable with the core operators than to memorize every trick.',
      codeTemplates: [
        {
          title: 'The core bitwise operators',
          problem:
            'General shape: the handful of operators every bit-manipulation problem is built from. XOR is the one with the most surprising applications — x ^ x = 0 and x ^ 0 = x — which is exactly what makes it useful for finding a missing number and for adding two integers without + or -.',
          code:
`void bitwiseOperators(int a, int b) {
    int and = a & b;        // AND: 1 where both bits are 1
    int or = a | b;         // OR: 1 where either bit is 1
    int xor = a ^ b;        // XOR: 1 where exactly one bit is 1
    int not = ~a;           // NOT: flips every bit (~a == -a - 1)
    int leftShift = a << 1; // multiply by 2
    int rightShift = a >> 1; // divide by 2 (sign-preserving)
    int lastBit = a & 1;    // isolate the least significant bit
}`,
        },
        {
          title: 'Worked example — Number of 1 Bits',
          problem:
            'Number of 1 Bits (LeetCode 191): count how many bits in an integer\'s binary representation are 1. n & (n - 1) is a classic trick: subtracting 1 flips every bit up to and including the lowest set bit, so ANDing that with the original number clears exactly that one bit. Repeating this exactly as many times as there are 1 bits is faster than checking all 32 bit positions one by one.',
          code:
`int hammingWeight(int n) {
    int count = 0;
    while (n != 0) {
        n = n & (n - 1); // clears the lowest set bit
        count++;
    }
    return count;
}`,
        },
        {
          title: 'Worked example — Missing Number',
          problem:
            'Missing Number (LeetCode 268): given n distinct numbers from 0 to n, find the one that is missing. XOR every index 0..n together with every value in the array; since a ^ a = 0, every number that appears in both the index range and the array cancels out in pairs, leaving only the one number with no pair — the missing one.',
          code:
`int missingNumber(int[] nums) {
    int result = nums.length; // account for index n, which has no array slot
    for (int i = 0; i < nums.length; i++) {
        result ^= i ^ nums[i];
    }
    return result;
}`,
        },
        {
          title: 'Worked example — Sum of Two Integers',
          problem:
            'Sum of Two Integers (LeetCode 371): compute a + b without using + or -. XOR adds two bits while ignoring any carry (1+1 "overflows" to 0), and AND followed by a left shift produces exactly the carry bits that XOR dropped. Keep folding that carry back in with XOR until there is no carry left.',
          code:
`int getSum(int a, int b) {
    while (b != 0) {
        int carry = (a & b) << 1; // bits that overflow into the next position
        a = a ^ b;                // add without carrying
        b = carry;                // add the carry in on the next pass
    }
    return a;
}`,
        },
      ],
      questions: [
        { number: 191, title: 'Number of 1 Bits', url: 'https://leetcode.com/problems/number-of-1-bits/' },
        { number: 190, title: 'Reverse Bits', url: 'https://leetcode.com/problems/reverse-bits/' },
        { number: 268, title: 'Missing Number', url: 'https://leetcode.com/problems/missing-number/' },
        { number: 371, title: 'Sum of Two Integers', url: 'https://leetcode.com/problems/sum-of-two-integers/' },
        { number: 338, title: 'Counting Bits', url: 'https://leetcode.com/problems/counting-bits/' },
      ],
      vizId: 'viz-bit-manipulation',
    },
  },
  {
    id: 'overlapping-intervals',
    order: 12,
    title: 'Overlapping Intervals',
    shortDesc: 'Sort by start time, then merge, insert, or find conflicts among ranges in a single pass.',
    content: {
      whenToUse: [
        'Merging or consolidating a set of ranges',
        'Scheduling, or finding conflicts — e.g. meeting rooms',
        'Finding gaps, or the minimum number of intervals to remove so the rest fit together',
      ],
      technique:
        'Almost every interval problem starts the same way: sort first, so you can process intervals in a guaranteed order instead of comparing every pair. Which field you sort by depends on the question. Sort by start time when you are merging or inserting — that way you only ever need to compare a new interval against the single most recently merged one, since anything earlier is already guaranteed not to reach this far. Sort by end time when you are greedily choosing which intervals to keep, as in scheduling the maximum number of non-overlapping meetings — keeping whichever interval finishes earliest always leaves the most room for everything that comes after it.',
      codeTemplates: [
        {
          title: 'Merge overlapping intervals (sort by start)',
          problem:
            'Merge Intervals (LeetCode 56): given a collection of intervals, merge all of the overlapping ones. Sorting by start time first guarantees each new interval only ever needs to be compared against the single most recently merged interval, instead of checked against every interval that came before it.',
          code:
`List<int[]> mergeIntervals(int[][] intervals) {
    Arrays.sort(intervals, (a, b) -> a[0] - b[0]); // sort by start time

    List<int[]> result = new ArrayList<>();
    for (int[] interval : intervals) {
        if (result.isEmpty() || result.get(result.size() - 1)[1] < interval[0]) {
            result.add(interval); // no overlap with the last merged interval
        } else {
            int[] last = result.get(result.size() - 1);
            last[1] = Math.max(last[1], interval[1]); // merge
        }
    }
    return result;
}`,
        },
        {
          title: 'Worked example — Insert Interval',
          problem:
            'Insert Interval (LeetCode 57): given a list of non-overlapping intervals already sorted by start time, insert a new interval and merge if necessary. Since the input is already sorted, one straight pass covers it: everything strictly before the new interval, everything that overlaps it (absorbed into one growing merge), then everything strictly after — with no re-sorting needed.',
          code:
`int[][] insert(int[][] intervals, int[] newInterval) {
    List<int[]> result = new ArrayList<>();
    int i = 0, n = intervals.length;

    while (i < n && intervals[i][1] < newInterval[0]) {
        result.add(intervals[i++]); // entirely before newInterval
    }

    int mergedStart = newInterval[0], mergedEnd = newInterval[1];
    while (i < n && intervals[i][0] <= mergedEnd) {
        mergedStart = Math.min(mergedStart, intervals[i][0]);
        mergedEnd = Math.max(mergedEnd, intervals[i][1]);
        i++;
    }
    result.add(new int[]{mergedStart, mergedEnd});

    while (i < n) {
        result.add(intervals[i++]); // entirely after newInterval
    }
    return result.toArray(new int[result.size()][]);
}`,
        },
        {
          title: 'Worked example — Non-overlapping Intervals (sort by end)',
          problem:
            'Non-overlapping Intervals (LeetCode 435): find the minimum number of intervals to remove so that none of the remaining ones overlap. Sort by END time instead of start: greedily keeping whichever interval finishes earliest always leaves the most room for everything after it, so any interval that starts before the previously kept one ends must be the one removed.',
          code:
`int eraseOverlapIntervals(int[][] intervals) {
    Arrays.sort(intervals, (a, b) -> a[1] - b[1]); // sort by END time this time

    int removed = 0;
    int prevEnd = Integer.MIN_VALUE;
    for (int[] interval : intervals) {
        if (interval[0] >= prevEnd) {
            prevEnd = interval[1]; // keep this interval
        } else {
            removed++; // overlaps the one we kept — remove it instead
        }
    }
    return removed;
}`,
        },
      ],
      questions: [
        { number: 57, title: 'Insert Interval', url: 'https://leetcode.com/problems/insert-interval/' },
        { number: 56, title: 'Merge Intervals', url: 'https://leetcode.com/problems/merge-intervals/' },
        { number: 435, title: 'Non-overlapping Intervals', url: 'https://leetcode.com/problems/non-overlapping-intervals/' },
        { number: 1834, title: 'Single-Threaded CPU', url: 'https://leetcode.com/problems/single-threaded-cpu/' },
      ],
      vizId: 'viz-overlapping-intervals',
    },
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
