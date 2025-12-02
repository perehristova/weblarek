import {
    IEvents
} from '../../base/Events';

export class CartView {
    protected container: HTMLElement;
    protected events: IEvents;

    protected list!: HTMLElement;
    protected totalElement!: HTMLElement;
    protected button!: HTMLButtonElement;

    constructor(events: IEvents, container: HTMLElement) {
        this.container = container;
        this.events = events;

        this.list = this.container.querySelector('.basket__list') as HTMLElement;
        this.totalElement = this.container.querySelector('.basket__price') as HTMLElement;
        this.button = this.container.querySelector('.basket__button') as HTMLButtonElement;

        if (this.button) {
            this.button.addEventListener('click', () => {
                this.events.emit('cart:checkout');
            });
        }
    }

    set items(items: HTMLElement[]) {
        if (items.length) {
            this.list.replaceChildren(...items);
            this.button.disabled = false;
        } else {
            this.list.replaceChildren();
            this.button.disabled = true;
        }
    }

    set total(total: number) {
        this.totalElement.textContent = `${total} синапсов`;
    }

    render(data ? : {
        total: number,
        items: HTMLElement[]
    }): HTMLElement {
        if (data) {
            this.total = data.total;
            this.items = data.items;
        }
        return this.container;
    }
}