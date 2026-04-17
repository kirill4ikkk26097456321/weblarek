import { Component } from '../base/Component';
import { IEvents } from '../base/Events';

export interface IFormState {
  valid: boolean;
  errors: string[];
}

export class Form<T extends object> extends Component<IFormState> {
  protected readonly _submit: HTMLButtonElement;
  protected readonly _errors: HTMLElement;

  constructor(
    protected readonly container: HTMLFormElement,
    protected readonly events: IEvents
  ) {
    super(container);

    this._submit = container.querySelector<HTMLButtonElement>('[type="submit"]')!;
    this._errors = container.querySelector<HTMLElement>('.form__errors')!;

    container.addEventListener('input', (e: Event) => {
      const target = e.target as HTMLInputElement;
      if (!target.name) return;
      const formName = container.name;
      const fieldName = target.name as keyof T;
      this.events.emit<{ field: keyof T; value: string }>(
        `${formName}.${String(fieldName)}:change`,
        { field: fieldName, value: target.value }
      );
    });

    container.addEventListener('submit', (e: Event) => {
      e.preventDefault();
      this.events.emit(`${container.name}:submit`);
    });
  }

  render(data: Partial<IFormState>): HTMLElement {
    if (data.valid !== undefined && this._submit) {
      this._submit.disabled = !data.valid;
    }
    if (data.errors !== undefined && this._errors) {
      this._errors.textContent = data.errors.join('; ');
    }
    return this.container;
  }
}

export interface IOrderFormData extends IFormState {
  payment: 'card' | 'cash' | null;
  address: string;
}

export class OrderForm extends Form<{ payment: string; address: string }> {
  private readonly _btnCard: HTMLButtonElement;
  private readonly _btnCash: HTMLButtonElement;

  constructor(container: HTMLFormElement, events: IEvents) {
    super(container, events);

    this._btnCard = container.querySelector<HTMLButtonElement>('[name="card"]')!;
    this._btnCash = container.querySelector<HTMLButtonElement>('[name="cash"]')!;

    const handlePayment = (method: 'card' | 'cash') => {
      this.setPaymentActive(method);
      this.events.emit<{ field: 'payment'; value: string }>(
        `${container.name}.payment:change`,
        { field: 'payment', value: method }
      );
    };

    this._btnCard.addEventListener('click', () => handlePayment('card'));
    this._btnCash.addEventListener('click', () => handlePayment('cash'));
  }

  private setPaymentActive(method: 'card' | 'cash'): void {
    this._btnCard.classList.toggle('button_alt-active', method === 'card');
    this._btnCash.classList.toggle('button_alt-active', method === 'cash');
  }

  render(data: Partial<IOrderFormData>): HTMLElement {
    super.render(data);

    if (data.payment !== undefined) {
      if (data.payment) {
        this.setPaymentActive(data.payment);
      } else {
        this._btnCard.classList.remove('button_alt-active');
        this._btnCash.classList.remove('button_alt-active');
      }
    }

    if (data.address !== undefined) {
      const input = this.container.querySelector<HTMLInputElement>('[name="address"]');
      if (input) input.value = data.address;
    }

    return this.container;
  }
}

export interface IContactsFormData extends IFormState {
  email: string;
  phone: string;
}

export class ContactsForm extends Form<{ email: string; phone: string }> {
  constructor(container: HTMLFormElement, events: IEvents) {
    super(container, events);

  }

  render(data: Partial<IContactsFormData>): HTMLElement {
    super.render(data);

    if (data.email !== undefined) {
      const input = this.container.querySelector<HTMLInputElement>('[name="email"]');
      if (input) input.value = data.email;
    }
    if (data.phone !== undefined) {
      const input = this.container.querySelector<HTMLInputElement>('[name="phone"]');
      if (input) input.value = data.phone;
    }

    return this.container;
  }
}
