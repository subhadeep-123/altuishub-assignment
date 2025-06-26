# DSA Assignment

## Question 1: Merge k Sorted Lists

You are given an array of k linkedlist heads, each list being sorted in ascending order. Write
a function to merge all the lists into one sorted linked list and return its head.
Example:

```
Input: lists:
[[1 -> 4 -> 5],[1 -> 3 -> 4],[2 -> 6]]

Output:
1 -> 1 -> 2 -> 3 -> 4 -> 4 -> 5 -> 6
```

Explanation: The merged linked list in ascending order.

## Solution

### Time Complexity

* `O(N Log k)` where N is the total number of nodes and k is the number of lists.
* Each insertion/extraction from the heap takes `log k` and we do this `N` times.