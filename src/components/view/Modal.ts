import { IEvents } from '../base/Events';

export class Modal {
  private readonly _closeButton: HTMLButtonElement;
  private readonly _content: HTMLElement;

  constructor(
    private readonly container: HTMLElement,
    private readonly events: IEvents
  ) {
    this._closeButton = this.container.querySelector<HTMLButtonElement>('.modal__close')!;
    this._content = this.container.querySelector<HTMLElement>('.modal__content')!;

    this._closeButton.addEventListener('click', () => this.close());

    this.container.addEventListener('click', (e: MouseEvent) => {
      if (e.target === this.container) {
        this.close();
      }
    });

    document.addEventListener('keydown', (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        this.close();
      }
    });
  }

  set content(value: HTMLElement | null) {
    this._content.replaceChildren(value ?? '');
  }

  open(): void {
    this.container.classList.add('modal_active');
    document.body.classList.add('modal-open');
  }

  close(): void {
    this.container.classList.remove('modal_active');
    document.body.classList.remove('modal-open');
    this._content.replaceChildren();
    this.events.emit('modal:close');
  }

  render(data: { content: HTMLElement }): HTMLElement {
    this.content = data.content;
    this.open();
    return this.container;
  }
}
