import { createElement } from "../../shared/utils/create-element";

interface Options {
  duration: number,
  type: 'success' | 'error'
}

export default class NotificationMessage {
  public duration: number;
  public type: string;
  public message: string;
  static activeNotification: NotificationMessage | undefined;
  private timer: number = 0;
  private element: HTMLElement;

  constructor(message: string, {duration, type}: Options) {
    if (NotificationMessage.activeNotification) {
      this.destroy();
    }

    this.duration = (duration) ? duration : 2000;
    this.type = (type) ? type : 'success';
    this.message = message;

    NotificationMessage.activeNotification = this;
  }

  public show(target?: HTMLElement): void {
    const containerElement = (target) ? target : document.body;

    const html = `<div class="notification ${this.type}" style="--value:${this.duration}ms">
                        <div class="timer"></div>
                        <div class="inner-wrapper">
                          <div class="notification-header">${this.type}</div>
                          <div class="notification-body">
                            ${this.message}
                          </div>
                        </div>
                      </div>`;

    this.element = createElement(html);
    containerElement.append(this.element);

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

    const element = <HTMLElement>document.querySelector('.notification');

    if (element) {
      element.remove();
    }
  }
}
