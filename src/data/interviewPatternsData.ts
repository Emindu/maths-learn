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
