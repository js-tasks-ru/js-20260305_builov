import { createElement } from "../../shared/utils/create-element";

interface Options {
  duration: number,
  type: 'success' | 'error'
}

export default class NotificationMessage {
  public duration: number;
  public type: string;
  public message: string;
  static activeNotification: NotificationMessage;
  private timer: number | undefined;
  public element: HTMLElement | undefined;

  constructor(message: string, {duration, type}: Options = {duration: 0, type: 'success'}) {
    if (NotificationMessage.activeNotification) {
      NotificationMessage.activeNotification.destroy();
    }

    this.duration = duration;
    this.type = type;
    this.message = message;

    NotificationMessage.activeNotification = this;
  }

  public show(target?: HTMLElement): void {
    console.log('show ', this.duration);

    const containerElement = (target) ? target : document.body;

    const html = `<div class="notification success" style="--value:${this.duration}ms">
                        <div class="timer"></div>
                        <div class="inner-wrapper">
                          <div class="notification-header">${this.type}</div>
                          <div class="notification-body">
                            ${this.message}
                          </div>
                        </div>
                      </div>`;

    containerElement.insertAdjacentHTML('beforeend', html);

    this.timer = setTimeout(() => {
      this.destroy();

    }, this.duration);
  }

  public remove(): void {
    console.log('call remove');

    const element = <HTMLElement>document.querySelector('.notification');

    if (element) {
      element.remove();
    }
  }

  public destroy(): void {
    console.log('call destroy');

    const element = <HTMLElement>document.querySelector('.notification');

    clearTimeout(this.timer);

    if (element) {
      element.remove();
    }
  }
}
