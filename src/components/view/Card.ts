import { Component } from '../base/Component';
import { IEvents } from '../base/Events';
import { categoryMap, CDN_URL } from '../../utils/constants';

export interface ICardData {
  id: string;
  title: string;
  image: string;
  price: number | null;
  category: string;
}

export interface ICardBasketData {
  id: string;
  title: string;
  price: number | null;
  index: number;
}

export interface ICardPreviewData extends ICardData {
  description: string;
  inBasket: boolean;
}

export class Card extends Component<ICardData> {
  protected readonly _title: HTMLElement;
  protected readonly _image: HTMLImageElement;
  protected readonly _price: HTMLElement;
  protected readonly _category: HTMLElement;

  constructor(container: HTMLElement) {
    super(container);

    this._title    = container.querySelector<HTMLElement>('.card__title')!;
    this._image    = container.querySelector<HTMLImageElement>('.card__image')!;
    this._price    = container.querySelector<HTMLElement>('.card__price')!;
    this._category = container.querySelector<HTMLElement>('.card__category')!;
  }

  protected setCategory(value: string): void {
    if (!this._category) return;

    const prevMod = this._category.className
      .split(' ')
      .find((c) => c.startsWith('card__category_'));
    if (prevMod) this._category.classList.remove(prevMod);

    this._category.textContent = value;
    const mod = categoryMap[value] ?? 'card__category_other';
    this._category.classList.add(mod);
  }

  protected formatPrice(value: number | null): string {
    return value === null ? 'Бесценно' : `${value} синапсов`;
  }

  render(data: Partial<ICardData>): HTMLElement {
    if (data.title    !== undefined && this._title)    this._title.textContent = data.title;
    if (data.category !== undefined) this.setCategory(data.category);
    if (data.price    !== undefined && this._price)    this._price.textContent = this.formatPrice(data.price);
    if (data.image    !== undefined && this._image)    this.setImage(this._image, CDN_URL + data.image, data.title);
    return this.container;
  }
}

export class CardCatalog extends Card {
  constructor(container: HTMLElement, private readonly events: IEvents) {
    super(container);

    container.addEventListener('click', () => {
      const id = container.dataset['id'];
      if (id) {
        this.events.emit<{ id: string }>('card:select', { id });
      }
    });
  }

  render(data: Partial<ICardData>): HTMLElement {
    if (data.id !== undefined) this.container.dataset['id'] = data.id;
    return super.render(data);
  }
}

export class CardPreview extends Card {
  private readonly _description: HTMLElement;
  private readonly _button: HTMLButtonElement;

  constructor(container: HTMLElement, private readonly events: IEvents) {
    super(container);

    this._description = container.querySelector<HTMLElement>('.card__text')!;
    this._button      = container.querySelector<HTMLButtonElement>('.card__button')!;

    this._button.addEventListener('click', () => {
      const id      = container.dataset['id'];
      const inBasket = container.dataset['inBasket'] === 'true';
      if (!id) return;
      if (inBasket) {
        this.events.emit<{ id: string }>('card:fromBasket', { id });
      } else {
        this.events.emit<{ id: string }>('card:toBasket', { id });
      }
    });
  }

  private updateButton(inBasket: boolean, price: number | null): void {
    if (price === null) {
      this._button.disabled     = true;
      this._button.textContent  = 'Недоступно';
    } else {
      this._button.disabled    = false;
      this._button.textContent = inBasket ? 'Удалить из корзины' : 'Купить';
    }
  }

  render(data: Partial<ICardPreviewData>): HTMLElement {
    if (data.id !== undefined) this.container.dataset['id'] = data.id;

    super.render(data);

    if (data.description !== undefined && this._description) {
      this._description.textContent = data.description;
    }

    const inBasket = data.inBasket ?? false;
    this.container.dataset['inBasket'] = String(inBasket);

    if (this._button) {
      this.updateButton(inBasket, data.price ?? null);
    }

    return this.container;
  }
}

export class CardBasket extends Component<ICardBasketData> {
  private readonly _index:       HTMLElement;
  private readonly _title:       HTMLElement;
  private readonly _price:       HTMLElement;
  private readonly _deleteButton: HTMLButtonElement;

  constructor(container: HTMLElement, private readonly events: IEvents) {
    super(container);

    this._index        = container.querySelector<HTMLElement>('.basket__item-index')!;
    this._title        = container.querySelector<HTMLElement>('.card__title')!;
    this._price        = container.querySelector<HTMLElement>('.card__price')!;
    this._deleteButton = container.querySelector<HTMLButtonElement>('.basket__item-delete')!;

    this._deleteButton.addEventListener('click', () => {
      const id = container.dataset['id'];
      if (id) {
        this.events.emit<{ id: string }>('card:removeFromBasket', { id });
      }
    });
  }

  render(data: Partial<ICardBasketData>): HTMLElement {
    if (data.id    !== undefined) this.container.dataset['id'] = data.id;
    if (data.index !== undefined && this._index) this._index.textContent = String(data.index);
    if (data.title !== undefined && this._title) this._title.textContent = data.title;
    if (data.price !== undefined && this._price) {
      this._price.textContent = data.price === null ? 'Бесценно' : `${data.price} синапсов`;
    }
    return this.container;
  }
}
