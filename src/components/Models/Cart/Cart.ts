import {
    IProduct
} from '../../../types';
import {
    IEvents
} from '../../base/Events';

export class Cart {
    private items: IProduct[] = [];
    private events: IEvents;

    constructor(events: IEvents) {
        this.events = events;
    }

    getItems(): IProduct[] {
        return this.items;
    }

    addItem(product: IProduct): void {
        this.items.push(product);
        this.events.emit('cart:changed');
    }

    removeItem(product: IProduct): void {
        const index = this.items.findIndex(item => item.id === product.id);
        if (index !== -1) {
            this.items.splice(index, 1);
            this.events.emit('cart:changed');
        }
    }

    clear(): void {
        this.items = [];
        this.events.emit('cart:changed');
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
}