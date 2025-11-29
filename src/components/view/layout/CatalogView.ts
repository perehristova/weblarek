// CatalogView.ts

import {
    Component
} from '../base/Component';
import {
    IProduct
} from '../../../types';
import {
    CatalogCard
} from '../cards/CatalogCard';
import {
    EventEmitter
} from '../../base/Events';
import {
    cloneTemplate
} from '../../../utils/utils';

export class CatalogView extends Component < IProduct[] > {
    private events: EventEmitter;
    private templateSelector = '#card-catalog';

    constructor(container: HTMLElement, events: EventEmitter) {
        super(container);
        this.events = events;
    }

    render(products: IProduct[]): HTMLElement {
        this.container.innerHTML = '';

        products.forEach(product => {
            const cardElement = cloneTemplate < HTMLElement > (this.templateSelector);

            const card = new CatalogCard(this.events, cardElement);

            const cardRendered = card.render(product);
            this.container.appendChild(cardRendered);
        });

        return this.container;
    }
}