import { Component } from '../base/Component';
import { IEvents } from '../base/Events';

export interface IPageView {
  counter: number;
  catalog: HTMLElement[];
  locked:  boolean;
}

export class Page extends Component<IPageView> {
  private readonly _counter: HTMLElement;
  private readonly _catalog: HTMLElement;
  private readonly _basket:  HTMLElement;
  private readonly _wrapper: HTMLElement;

  constructor(container: HTMLElement, private readonly events: IEvents) {
    super(container);

    this._counter = container.querySelector<HTMLElement>('.header__basket-counter')!;
    this._catalog = container.querySelector<HTMLElement>('.gallery')!;
    this._basket  = container.querySelector<HTMLElement>('.header__basket')!;
    this._wrapper = container.querySelector<HTMLElement>('.page__wrapper')!;

    this._basket.addEventListener('click', () => {
      this.events.emit('basket:open');
    });
  }

  render(data: Partial<IPageView>): HTMLElement {
    if (data.counter !== undefined && this._counter) {
      this._counter.textContent = String(data.counter);
    }

    if (data.catalog !== undefined && this._catalog) {
      this._catalog.replaceChildren(...data.catalog);
    }

    if (data.locked !== undefined && this._wrapper) {
      this._wrapper.classList.toggle('page__wrapper_locked', data.locked);
    }

    return this.container;
  }
}
