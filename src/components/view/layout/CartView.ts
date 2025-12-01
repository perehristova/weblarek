import {
    IEvents
} from '../../base/Events';

export class CartView {
    protected container: HTMLElement;
    protected events: IEvents;
    protected _list: HTMLElement;
    protected _total: HTMLElement;
    protected _button: HTMLButtonElement;

    constructor(events: IEvents, container: HTMLElement) {
        this.container = container;
        this.events = events;

        // Поиск элементов СТРОГО внутри container
        this._list = this.container.querySelector('.basket__list') as HTMLElement;
        this._total = this.container.querySelector('.basket__price') as HTMLElement;
        this._button = this.container.querySelector('.basket__button') as HTMLButtonElement;

        if (this._button) {
            this._button.addEventListener('click', () => {
                this.events.emit('cart:checkout');
            });
        }
    }

    // Сеттер items: принимает готовые HTMLElement[]
    set items(items: HTMLElement[]) {
        if (items.length) {
            this._list.replaceChildren(...items);
            this._button.disabled = false;
        } else {
            this._list.replaceChildren();
            this._button.disabled = true;
        }
    }

    // Сеттер total
    set total(total: number) {
        this._total.textContent = `${total} синапсов`;
    }

    get element(): HTMLElement {
        return this.container;
    }
}