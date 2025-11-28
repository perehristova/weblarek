import {
    Component
} from '../base/Component';
import {
    EventEmitter
} from '../../base/Events';

export class Header extends Component < number > {
    private events: EventEmitter;
    private basketButton: HTMLButtonElement;
    private basketCounter: HTMLElement;

    constructor(events: EventEmitter) {
        // Используем существующий header из HTML
        super(document.querySelector('.header') !);

        this.events = events;
        this.basketButton = this.container.querySelector('.header__basket') !;
        this.basketCounter = this.container.querySelector('.header__basket-counter') !;

        // Вешаем обработчик на клик по корзине
        this.basketButton.addEventListener('click', () => {
            this.handleBasketClick();
        });
    }

    render(cartItemsCount: number): HTMLElement {
        // Обновляем счетчик товаров в корзине
        this.setText(this.basketCounter, cartItemsCount.toString());

        return this.container;
    }

    private handleBasketClick(): void {
        // Генерируем событие открытия корзины
        this.events.emit('cart:open');
    }

    // Дополнительный метод для обновления только счетчика
    updateCounter(count: number): void {
        this.setText(this.basketCounter, count.toString());
    }
}