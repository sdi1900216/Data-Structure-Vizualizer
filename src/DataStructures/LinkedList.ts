export class LinkedListNode {
  value: any;
  next: LinkedListNode | null;

  constructor(value: any) {
    this.value = value;
    this.next = null;
  }
}

export class LinkedList {
  head: LinkedListNode | null = null;

  append(value: any) {
    const newNode = new LinkedListNode(value);
    if (!this.head) {
      this.head = newNode;
      return;
    }
    let curr = this.head;
    while (curr.next) curr = curr.next;
    curr.next = newNode;
  }

  removeHead() {
    if (!this.head) return null;
    const removed = this.head;
    this.head = this.head.next;
    return removed.value;
  }

  toArray() {
    const arr = [];
    let curr = this.head;
    while (curr) {
      arr.push(curr.value);
      curr = curr.next;
    }
    return arr;
  }

  clear() {
    this.head = null;
  }
}