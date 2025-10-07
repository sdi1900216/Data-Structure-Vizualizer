export default class Queue<T> {
  private items: T[] = [];

  enqueue(item: T) {
    this.items.push(item);
  }

  dequeue(): T | undefined {
    return this.items.shift();
  }

  getItems(): T[] {
    return [...this.items];
  }

  clear() {
    this.items = [];
  }
}