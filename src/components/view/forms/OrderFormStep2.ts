import {
    Form
} from '../base/Form';
import {
    IBuyer
} from '../../../types';
import {
    cloneTemplate
} from '../../../utils/utils';
import {
    EventEmitter
} from '../../base/Events';

export class OrderFormStep2 extends Form < IBuyer > {
    private emailInput: HTMLInputElement;
    private phoneInput: HTMLInputElement;

    constructor(events: EventEmitter) {
        const template = document.getElementById('contacts') as HTMLTemplateElement;
        super(events, cloneTemplate(template));

        this.emailInput = this.container.querySelector('input[name="email"]') !;
        this.phoneInput = this.container.querySelector('input[name="phone"]') !;

        this.setupFieldListeners();
    }

    render(data ? : IBuyer): HTMLElement {
        this.resetForm();

        if (data) {
            if (data.email) {
                this.emailInput.value = data.email;
            }
            if (data.phone) {
                this.phoneInput.value = data.phone;
            }
        }

        this.updateSubmitButton();
        return this.container;
    }

    private setupFieldListeners(): void {
        this.emailInput.addEventListener('input', () => {
            this.handleFieldChange();
        });

        this.phoneInput.addEventListener('input', () => {
            this.handleFieldChange();
        });
    }

    private handleFieldChange(): void {
        this.clearErrors();
        this.updateSubmitButton();
    }

    protected handleSubmit(): void {
        const errors = this.validate();

        if (Object.keys(errors).length === 0) {
            const formData = this.getFormData();
            this.events.emit('order:submit:step2', formData);
        } else {
            this.showErrors(errors);
        }
    }

    protected validate(): Record < string,
    string > {
        const errors: Record < string, string > = {};

        const email = this.emailInput.value.trim();
        const phone = this.phoneInput.value.trim();

        if (!email) {
            errors.email = 'Введите email';
        } else if (!this.isValidEmail(email)) {
            errors.email = 'Введите корректный email';
        }

        if (!phone) {
            errors.phone = 'Введите телефон';
        } else if (!this.isValidPhone(phone)) {
            errors.phone = 'Введите корректный телефон';
        }

        return errors;
    }

    private isValidEmail(email: string): boolean {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    private isValidPhone(phone: string): boolean {
        const phoneRegex = /^[\d\s\-\+\(\)]+$/;
        return phoneRegex.test(phone) && phone.length >= 5;
    }

    private getFormData(): Partial < IBuyer > {
        return {
            email: this.emailInput.value.trim(),
            phone: this.phoneInput.value.trim()
        };
    }
}