import { IProduct } from '../../../types';
import { IEvents } from '../../base/Events';

export class Catalog {
    private products: IProduct[] = [];
    private selectedProduct: IProduct | null = null;
    private events: IEvents;

    constructor(events: IEvents) {
        this.events = events;
    }

    setProducts(products: IProduct[]): void {
        this.products = products;
        this.events.emit('catalog:changed', products);
    }

    getProducts(): IProduct[] {
        return this.products;
    }

    getProductById(id: string): IProduct | undefined {
        return this.products.find(product => product.id === id);
    }

    setSelectedProduct(product: IProduct): void {
        this.selectedProduct = product;
    }

    getSelectedProduct(): IProduct | null {
        return this.selectedProduct;
    }
}