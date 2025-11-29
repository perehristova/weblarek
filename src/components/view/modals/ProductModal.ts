// ProductModal.ts

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

    constructor(modal: Modal, events: EventEmitter, previewTemplate: HTMLElement) {
        super(document.createElement('div'));
        this.events = events;
        this.modal = modal;
        this.previewCard = new PreviewCard(events, previewTemplate);
    }

    render(): HTMLElement {
        return this.container;
    }

    open(product: IProduct, inCart: boolean = false): void {
        const productContent = this.previewCard.render(product, inCart);
        this.modal.open(productContent);

        this.events.emit('product:open', {
            product
        });
    }

    close(): void {
        this.modal.close();
    }

    updateCartState(product: IProduct, inCart: boolean): void {
        const productContent = this.previewCard.render(product, inCart);
        this.modal.setContent(productContent);
    }
}