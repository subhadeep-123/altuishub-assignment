import heapq

class ListNodes:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next

    def __lt__(self, other):
        # For heapq to compare the nodes
        return self.val > other.val
    

def mergeKLists(lists):
    heap = []

    # Initialize the heap with head of the each node
    for l in lists:
        if l:
            heapq.heappush(heap, l)

    dummy = ListNodes(0)
    curr = dummy

    # Pop the smallest element from the heap
    while heap:
        node = heapq.heappop(heap)
        curr.next = node
        curr = curr.next

        # Push the next element of that list into the heap
        if node.next:
            heapq.heappush(heap,node.next)

    return dummy.next