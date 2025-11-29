import {
    IBuyer,
    IValidationErrors
} from '../../../types';
import {
    EventEmitter
} from '../../base/Events';

export class Buyer {
    private data: IBuyer = {
        payment: '',
        email: '',
        phone: '',
        address: ''
    };
    private events: EventEmitter;

    constructor(events: EventEmitter) {
        this.events = events;
    }

    setData(data: Partial < IBuyer > ): void {
        this.data = {
            ...this.data,
            ...data
        };
        this.events.emit('buyer:changed', this.data);
    }

    clear(): void {
        this.data = {
            payment: '',
            email: '',
            phone: '',
            address: ''
        };
        this.events.emit('buyer:changed', this.data);
    }

    getData(): IBuyer {
        return {
            ...this.data
        };
    }

    // Валидация для формы оплаты (payment и address)
    validatePayment(): IValidationErrors {
        const errors: IValidationErrors = {};

        if (!this.data.payment) {
            errors.payment = 'Не выбран вид оплаты';
        }

        if (!this.data.address.trim()) {
            errors.address = 'Укажите адрес';
        }

        return errors;
    }

    // Валидация для формы контактов (email и phone)
    validateContacts(): IValidationErrors {
        const errors: IValidationErrors = {};
        const email = this.data.email.trim();
        const phone = this.data.phone.trim();

        if (!email) {
            errors.email = 'Укажите email';
        }

        if (!phone) {
            errors.phone = 'Укажите телефон';
        }

        return errors;
    }
}