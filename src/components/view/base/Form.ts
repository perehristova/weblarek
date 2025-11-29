import {
    Component
} from '../base/Component';
import {
    EventEmitter
} from '../../base/Events';
import {
    IValidationErrors
} from '../../../types';

export abstract class Form < T > extends Component < T > {
    protected events: EventEmitter;
    protected formElement: HTMLFormElement;
    protected submitButton: HTMLButtonElement;
    protected errorsElement: HTMLElement;

    constructor(events: EventEmitter, container: HTMLElement) {
        super(container);

        this.events = events;
        this.formElement = this.container as HTMLFormElement;
        this.submitButton = this.container.querySelector('button[type="submit"]') !;
        this.errorsElement = this.container.querySelector('.form__errors') !;

        this.setupEventListeners();
    }

    protected setupEventListeners(): void {
        this.formElement.addEventListener('submit', (event) => {
            event.preventDefault();
            this.handleSubmit();
        });
    }

    protected abstract handleSubmit(): void;

    public setErrors(errors: Partial < IValidationErrors > ): void {
        const errorText = Object.values(errors).filter(Boolean).join('; ');
        this.setText(this.errorsElement, errorText);

        this.setDisabled(this.submitButton, errorText.length > 0);
    }

    protected resetForm(): void {
        this.formElement.reset();
        this.setErrors({});
    }

    render(data ? : T): HTMLElement {
        return this.container;
    }
}