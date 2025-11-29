import {
    IProduct
} from '../../../types';
import {
    EventEmitter
} from '../../base/Events';

export class Cart {
    private items: IProduct[] = [];
    private events: EventEmitter;

    constructor(events: EventEmitter) {
        this.events = events;
    }

    addItem(product: IProduct): void {
        this.items.push(product);
        this.events.emit('cart:changed', this.getData());
    }

    removeItem(product: IProduct): void {
        const index = this.items.findIndex(item => item.id === product.id);
        if (index !== -1) {
            this.items.splice(index, 1);
            this.events.emit('cart:changed', this.getData());
        }
    }

    clear(): void {
        this.items = [];
        this.events.emit('cart:changed', this.getData());
    }

    getTotalPrice(): number {
        return this.items.reduce((total, item) => {
            return total + (item.price || 0);
        }, 0);
    }

    getTotalCount(): number {
        return this.items.length;
    }

    contains(productId: string): boolean {
        return this.items.some(item => item.id === productId);
    }

    getItems(): IProduct[] {
        return [...this.items];
    }

    getData(): {
        items: IProduct[];total: number;count: number
    } {
        return {
            items: [...this.items],
            total: this.getTotalPrice(),
            count: this.getTotalCount()
        };
    }
}