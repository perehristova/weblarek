import {
    Component
} from '../base/Component';
import {
    EventEmitter
} from '../../base/Events';
import {
    cloneTemplate
} from '../../../utils/utils';

interface ISuccessModalData {
    total: number;
}

export class SuccessModal extends Component < ISuccessModalData > {
    private events: EventEmitter;
    private closeButton: HTMLButtonElement;
    private descriptionElement: HTMLElement;

    constructor(events: EventEmitter) {
        // Используем шаблон успешного заказа
        const template = document.getElementById('success') as HTMLTemplateElement;
        super(cloneTemplate(template));

        this.events = events;
        this.closeButton = this.container.querySelector('.order-success__close') !;
        this.descriptionElement = this.container.querySelector('.order-success__description') !;

        // Вешаем обработчик на кнопку закрытия
        this.closeButton.addEventListener('click', () => {
            this.handleClose();
        });
    }

    render(data: ISuccessModalData): HTMLElement {
        // Обновляем описание с общей стоимостью
        this.setText(this.descriptionElement, `Списано ${data.total} синапсов`);

        return this.container;
    }

    private handleClose(): void {
        // Генерируем событие закрытия успешного модального окна
        this.events.emit('success:close');
    }

    // Метод для открытия (обычно используется с Modal)
    open(modal: any, data: ISuccessModalData): void {
        this.render(data);
        modal.open(this.container);
    }
}