import {
    IEvents
} from '../../base/Events';
import {
    IValidationErrors
} from '../../../types';


export abstract class Form < T > {
    protected container: HTMLElement;
    protected events: IEvents;
    protected formElement: HTMLFormElement;
    protected submitButton: HTMLButtonElement;
    protected errorsElement: HTMLElement;

    constructor(events: IEvents, container: HTMLElement) {
        this.container = container;
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

    public clearErrors(): void {
        this.errorsElement.textContent = '';
    }

    public setErrors(errors: Partial < IValidationErrors > ): void {
        const errorText = Object.values(errors).filter(Boolean).join('; ');

        this.errorsElement.textContent = errorText;
        this.submitButton.disabled = errorText.length > 0;
    }
}