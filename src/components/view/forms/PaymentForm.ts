import {
    Form
} from '../base/Form';
import {
    IBuyer,
    TPayment
} from '../../../types';
import {
    cloneTemplate
} from '../../../utils/utils';
import {
    EventEmitter
} from '../../base/Events';

export class PaymentForm extends Form < IBuyer > {
    private paymentButtons: NodeListOf < HTMLButtonElement > ;
    private addressInput: HTMLInputElement;
    private selectedPayment: TPayment = '';

    constructor(events: EventEmitter) {
        const template = document.getElementById('order') as HTMLTemplateElement;
        super(events, cloneTemplate(template));

        this.paymentButtons = this.container.querySelectorAll('button[name]');
        this.addressInput = this.container.querySelector('input[name="address"]') !;

        this.setupPaymentListeners();
    }

    render(data ? : IBuyer): HTMLElement {
        this.resetForm();

        if (data) {
            if (data.payment) {
                this.setPayment(data.payment);
            }
            if (data.address) {
                this.addressInput.value = data.address;
            }
        }

        this.updateSubmitButton();
        return this.container;
    }

    private setupPaymentListeners(): void {
        this.paymentButtons.forEach(button => {
            button.addEventListener('click', () => {
                this.handlePaymentSelect(button.name as TPayment);
            });
        });

        this.addressInput.addEventListener('input', () => {
            this.handleAddressChange();
        });
    }

    private handlePaymentSelect(payment: TPayment): void {
        this.setPayment(payment);
        this.validateAndShowErrors();
        this.updateSubmitButton();
    }

    private handleAddressChange(): void {
        this.validateAndShowErrors();
        this.updateSubmitButton();
    }

    private validateAndShowErrors(): void {
        const errors = this.validate();
        if (Object.keys(errors).length > 0) {
            this.showErrors(errors);
        } else {
            this.clearErrors();
        }
    }

    protected handleSubmit(): void {
        const errors = this.validate();

        if (Object.keys(errors).length === 0) {
            this.clearErrors();
            const formData = this.getFormData();
            this.events.emit('payment:submit', formData);
        } else {
            this.showErrors(errors);
        }
    }

    protected validate(): Record < string,
    string > {
        const errors: Record < string, string > = {};

        if (!this.selectedPayment) {
            errors.payment = 'Необходимо указать способ оплаты';
        }

        if (!this.addressInput.value.trim()) {
            errors.address = 'Необходимо указать адрес';
        }

        return errors;
    }

    private getFormData(): Partial < IBuyer > {
        return {
            payment: this.selectedPayment,
            address: this.addressInput.value.trim()
        };
    }

    private setPayment(payment: TPayment): void {
        this.selectedPayment = payment;

        this.paymentButtons.forEach(button => {
            if (button.name === payment) {
                button.classList.add('button_alt-active');
            } else {
                button.classList.remove('button_alt-active');
            }
        });
    }

    protected resetForm(): void {
        super.resetForm();
        this.selectedPayment = '';
        this.paymentButtons.forEach(button => {
            button.classList.remove('button_alt-active');
        });
    }
}