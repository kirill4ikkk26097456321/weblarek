import { Component } from '../base/Component';
import { IEvents } from '../base/Events';

export interface ISuccessView {
  total: number;
}

export class Success extends Component<ISuccessView> {
  private readonly _description: HTMLElement;
  private readonly _button: HTMLButtonElement;

  constructor(container: HTMLElement, private readonly events: IEvents) {
    super(container);

    this._description = container.querySelector<HTMLElement>('.order-success__description')!;
    this._button      = container.querySelector<HTMLButtonElement>('.order-success__close')!;

    this._button.addEventListener('click', () => {
      this.events.emit('success:close');
    });
  }

  render(data: Partial<ISuccessView>): HTMLElement {
    if (data.total !== undefined && this._description) {
      this._description.textContent = `Списано ${data.total} синапсов`;
    }
    return this.container;
  }
}
