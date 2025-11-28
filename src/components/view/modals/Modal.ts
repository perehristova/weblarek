import {
    Component
} from '../base/Component';
import {
    EventEmitter
} from '../../base/Events';

export class Modal extends Component < HTMLElement > {
    private events: EventEmitter;
    private closeButton: HTMLButtonElement;
    private contentElement: HTMLElement;

    constructor(events: EventEmitter) {
        // Используем существующий контейнер модального окна из HTML
        const modalContainer = document.getElementById('modal-container') as HTMLElement;
        super(modalContainer);

        this.events = events;
        this.closeButton = this.container.querySelector('.modal__close') !;
        this.contentElement = this.container.querySelector('.modal__content') !;

        // Вешаем обработчики закрытия
        this.closeButton.addEventListener('click', () => this.close());
        this.container.addEventListener('click', (event) => this.handleOverlayClick(event));

        // Блокируем закрытие при клике на контент
        this.contentElement.addEventListener('click', (event) => event.stopPropagation());
    }

    render(content ? : HTMLElement): HTMLElement {
        // Очищаем контент перед рендером
        this.contentElement.innerHTML = '';

        // Если передан контент - добавляем его
        if (content) {
            this.contentElement.appendChild(content);
        }

        return this.container;
    }

    open(content ? : HTMLElement): void {
        // Рендерим контент если передан
        if (content) {
            this.render(content);
        }

        // Показываем модальное окно
        this.container.classList.add('modal_active');

        // Блокируем скролл страницы
        document.body.style.overflow = 'hidden';

        // Генерируем событие открытия
        this.events.emit('modal:open');
    }

    close(): void {
        // Скрываем модальное окно
        this.container.classList.remove('modal_active');

        // Разблокируем скролл страницы
        document.body.style.overflow = '';

        // Очищаем контент
        this.contentElement.innerHTML = '';

        // Генерируем событие закрытия
        this.events.emit('modal:close');
    }

    private handleOverlayClick(event: MouseEvent): void {
        // Закрываем модальное окно при клике на оверлей (вне контента)
        if (event.target === this.container) {
            this.close();
        }
    }

    // Метод для установки содержимого без открытия
    setContent(content: HTMLElement): void {
        this.contentElement.innerHTML = '';
        this.contentElement.appendChild(content);
    }
}