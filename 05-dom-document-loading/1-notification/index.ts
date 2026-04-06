import { createElement } from "../../shared/utils/create-element";

interface Options {
  duration?: number,
  type?: 'success' | 'error'
}

export default class NotificationMessage {
  public duration: number;
  public type: string;
  public message: string;
  static activeNotification: NotificationMessage | undefined;
  private timer: number = 0;
  public element: HTMLElement | undefined;
  private containerElement: HTMLElement | undefined;

  constructor(message: string, { duration = 2000, type = 'success' }: Options = {}) {
    if (NotificationMessage.activeNotification) {
      NotificationMessage.activeNotification?.destroy();
    }

    this.duration = duration;
    this.type = type;
    this.message = message;

    NotificationMessage.activeNotification = this;
  }

  public show(target?: HTMLElement): void {
    if (target) {
      this.containerElement = target;

      document.body.append(this.containerElement);
    }

    const html = `<div class="notification ${this.type}" style="--value:${this.duration / 1000}s">
                        <div class="timer"></div>
                        <div class="inner-wrapper">
                          <div class="notification-header">${this.type}</div>
                          <div class="notification-body">
                            ${this.message}
                          </div>
                        </div>
                      </div>`;

    this.element = createElement(html);

    if (this.containerElement) {
      this.containerElement.append(this.element);
    } else {
      document.body.append(this.element);
    }

    this.timer = setTimeout(() => {
      this.remove();

    }, this.duration);
  }

  public remove(): void {
    if (this.element) {
      this.element.remove();
    }
  }

  public destroy(): void {
    clearTimeout(this.timer);

    this.remove();

    if (this.containerElement) {
      this.containerElement.remove();
    }

    NotificationMessage.activeNotification = undefined;
  }
}
