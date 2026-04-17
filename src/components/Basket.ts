import { IProduct } from '../types';
import { IEvents } from './base/Events';

export class Basket {
  protected items: IProduct[] = [];

  constructor(protected events: IEvents) {}

  getItems(): IProduct[] {
    return this.items;
  }

  add(item: IProduct): void {
    if (!this.contains(item.id)) {
      this.items.push(item);
      this.events.emit('basket:change', { items: this.items });
    }
  }

  remove(id: string): void {
    this.items = this.items.filter(item => item.id !== id);
    this.events.emit('basket:change', { items: this.items });
  }

  clear(): void {
    this.items = [];
    this.events.emit('basket:change', { items: this.items });
  }

  getTotal(): number {
    return this.items.reduce((total, item) => total + (item.price || 0), 0);
  }

  getCount(): number {
    return this.items.length;
  }

  contains(id: string): boolean {
    return this.items.some(item => item.id === id);
  }
}
