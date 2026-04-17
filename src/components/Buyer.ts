import { IBuyer, FormErrors } from '../types';
import { IEvents } from './base/Events';

export class Buyer {
  protected data: IBuyer = {
    payment: null,
    email: '',
    phone: '',
    address: ''
  };

  constructor(protected events: IEvents) {}

  setField<K extends keyof IBuyer>(field: K, value: IBuyer[K]): void {
    this.data[field] = value;
    this.events.emit('buyer:change', { field, value });
    this.events.emit('formErrors:change', this.validate());
  }

  getData(): IBuyer {
    return this.data;
  }

  clear(): void {
    this.data = {
      payment: null,
      email: '',
      phone: '',
      address: ''
    };
    this.events.emit('buyer:change', this.data);
  }

  validate(): FormErrors {
    const errors: FormErrors = {};

    if (!this.data.payment) {
      errors.payment = 'Не выбран вид оплаты';
    }
    if (!this.data.address) {
      errors.address = 'Укажите адрес';
    }
    if (!this.data.email) {
      errors.email = 'Укажите email';
    }
    if (!this.data.phone) {
      errors.phone = 'Укажите телефон';
    }

    return errors;
  }
}
