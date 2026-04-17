export abstract class Component<T> {
    protected constructor(protected readonly container: HTMLElement) {

    }

    protected setImage(element: HTMLImageElement, src: string, alt?: string) {
        if (element) {
            element.src = src;
            if (alt) {
                element.alt = alt;
            }
        }
    }

    protected setText(element: HTMLElement | null, value: unknown): void {
        if (element) {
            element.textContent = String(value);
        }
    }

    protected toggleClass(element: HTMLElement | null, className: string, force?: boolean): void {
        if (element) {
            element.classList.toggle(className, force);
        }
    }

    protected setDisabled(element: HTMLElement | null, state: boolean): void {
        if (element) {
            if (state) {
                element.setAttribute('disabled', 'disabled');
            } else {
                element.removeAttribute('disabled');
            }
        }
    }

    protected setHidden(element: HTMLElement | null): void {
        if (element) {
            element.style.display = 'none';
        }
    }

    protected setVisible(element: HTMLElement | null): void {
        if (element) {
            element.style.removeProperty('display');
        }
    }

    render(data?: Partial<T>): HTMLElement {
        Object.assign(this as object, data ?? {});
        return this.container;
    }
}
