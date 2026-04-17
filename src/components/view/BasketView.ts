import { Component } from '../base/Component';
import { IEvents } from '../base/Events';

export interface IBasketView {
  items: HTMLElement[];
  total: number;
}

export class BasketView extends Component<IBasketView> {
  private readonly _list:   HTMLUListElement;
  private readonly _total:  HTMLElement;
  private readonly _button: HTMLButtonElement;

  constructor(container: HTMLElement, private readonly events: IEvents) {
    super(container);

    this._list   = container.querySelector<HTMLUListElement>('.basket__list')!;
    this._total  = container.querySelector<HTMLElement>('.basket__price')!;
    this._button = container.querySelector<HTMLButtonElement>('.basket__button')!;

    this._button.addEventListener('click', () => {
      this.events.emit('order:open');
    });
  }

  render(data: Partial<IBasketView>): HTMLElement {
    if (data.items !== undefined) {
      this._list.replaceChildren(...data.items);
      this._button.disabled = data.items.length === 0;
    }

    if (data.total !== undefined) {
      this._total.textContent = `${data.total} синапсов`;
    }

    return this.container;
  }
}
