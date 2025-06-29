import heapq

class ListNodes:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next

    def __lt__(self, other):
        # For heapq to compare the nodes
        return self.val < other.val
    

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

# Helper Scripts
def build_linked_lists(values):
    head = ListNodes(values[0])
    current = head
    for v in values[1:]:
        current.next = ListNodes(v)
        current = current.next

    return head


if __name__ == '__main__':
    lists = [
        build_linked_lists([1, 4, 5]),
        build_linked_lists([1, 3, 4]),
        build_linked_lists([2, 6])
    ]

    merged = mergeKLists(lists)
    
    # Print the merged lists
    while merged:
        print(merged.val, end = " -> " if merged.next else "\n")
        merged = merged.next

