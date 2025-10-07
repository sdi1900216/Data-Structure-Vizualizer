export default class Stack<T> {
  private items: T[] = [];

  push(item: T) {
    this.items.push(item);
  }

  pop(): T | undefined {
    return this.items.pop();
  }

  getItems(): T[] {
    return [...this.items];
  }

  clear() {
    this.items = [];
  }
}