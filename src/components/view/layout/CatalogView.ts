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

export class CatalogView extends Component < IProduct[] > {
    private events: EventEmitter;

    constructor(events: EventEmitter) {
        // Используем контейнер .gallery из HTML
        super(document.querySelector('.gallery') !);
        this.events = events;
    }

    render(products: IProduct[]): HTMLElement {
        // Очищаем контейнер перед рендером
        this.container.innerHTML = '';

        // Создаем карточки для каждого товара
        products.forEach(product => {
            const card = new CatalogCard(this.events);
            const cardElement = card.render(product);
            this.container.appendChild(cardElement);
        });

        return this.container;
    }
}