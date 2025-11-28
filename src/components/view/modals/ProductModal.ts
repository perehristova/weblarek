import {
    Component
} from '../base/Component';
import {
    IProduct
} from '../../../types';
import {
    PreviewCard
} from '../cards/PreviewCard';
import {
    EventEmitter
} from '../../base/Events';
import {
    Modal
} from './Modal';

export class ProductModal extends Component < null > {
    private events: EventEmitter;
    private modal: Modal;
    private previewCard: PreviewCard;
    private currentProduct: IProduct | null = null;

    constructor(events: EventEmitter, modal: Modal) {
        super(document.createElement('div'));

        this.events = events;
        this.modal = modal;
        this.previewCard = new PreviewCard(events);
    }

    render(): HTMLElement {
        return this.container;
    }

    open(product: IProduct, inCart: boolean = false): void {
        this.currentProduct = product;

        const productContent = this.previewCard.render(product, inCart);
        this.modal.open(productContent);
        this.events.emit('product:open', {
            product
        });
    }

    close(): void {
        this.modal.close();
        this.currentProduct = null;
    }

    updateCartState(inCart: boolean): void {
        if (this.currentProduct) {
            const productContent = this.previewCard.render(this.currentProduct, inCart);
            this.modal.setContent(productContent);
        }
    }
}