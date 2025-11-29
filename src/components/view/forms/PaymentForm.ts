import {
    Form
} from '../base/Form';
import {
    IBuyer,
    TPayment
} from '../../../types';
import {
    EventEmitter
} from '../../base/Events';

// Тип T уменьшен до необходимого минимума
export class PaymentForm extends Form < Partial < Pick < IBuyer, 'payment' | 'address' >>> {
    private paymentButtons: NodeListOf < HTMLButtonElement > ;
    private addressInput: HTMLInputElement;

    constructor(events: EventEmitter, container: HTMLElement) {
        super(events, container);

        this.paymentButtons = this.container.querySelectorAll('button[name]');
        this.addressInput = this.container.querySelector('input[name="address"]') !;

        this.setupPaymentListeners();
    }

    private getSelectedPayment(): TPayment {
        const activeCard = this.container.querySelector('.button[name="card"].button_alt-active');
        const activeCash = this.container.querySelector('.button[name="cash"].button_alt-active');
        if (activeCard) return 'card';
        if (activeCash) return 'cash';
        return '';
    }

    private setPayment(payment: TPayment): void {
        this.paymentButtons.forEach(button => {
            const isActive = button.name === payment;
            button.classList.toggle('button_alt-active', isActive);
        });
    }

    private setupPaymentListeners(): void {
        this.paymentButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                this.setPayment(button.name as TPayment);
                this.emitChange();
            });
        });

        this.addressInput.addEventListener('input', () => {
            this.emitChange();
        });
    }

    private emitChange(): void {
        const formData = this.getFormData();
        this.events.emit('payment:change', formData);
    }

    protected handleSubmit(): void {
        const formData = this.getFormData();
        this.events.emit('payment:submit', formData);
    }

    private getFormData(): Partial < IBuyer > {
        return {
            payment: this.getSelectedPayment(),
            address: this.addressInput.value.trim()
        };
    }

    render(data: Partial < Pick < IBuyer, 'payment' | 'address' >> ): HTMLElement {
        super.render(data);

        if (data.address) {
            this.addressInput.value = data.address;
        }

        this.setPayment(data.payment || '');

        return this.container;
    }
}