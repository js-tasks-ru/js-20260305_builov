import { createElement } from "../../shared/utils/create-element";

interface Options {
  data: number[];
  label: string;
  value: number;
  link: string | null | undefined;
  formatHeading: any;
}

export default class ColumnChart {
  private data: number[];
  private label: string;
  private value: number;
  private link: string | null | undefined;
  private formatHeading: any;

  public element: HTMLElement | null;
  private chartHeight: number = 50;

  update(data: number[]) {

  }

  remove() {

  }

  destroy() {

  }

  // @ts-ignore
  constructor({
                data = [],
                label = '',
                value = 0,
                link = '',
                formatHeading = (val: number) => val
              }: Options = {}) {

    this.data = data;
    this.label = label;
    this.value = value;
    this.link = link;
    this.formatHeading = formatHeading;

    this.setElement();
  }

  private setElement(): void {
    let maxValue: number = 0;
    this.data.forEach(function(item: number, index: number, array: number[]) {
      maxValue = (item > maxValue) ? item : maxValue;
    });

    const scale: number = this.chartHeight / maxValue;
    const linkElement = (this.link !== '') ? `<a href="${this.link}" class="column-chart__link">View all</a>` : '';
    const data = this.data.map(function(item: number) {
      const value: number = Math.floor(item * scale);
      const tooltip: string = (item / maxValue * 100).toFixed(0) + '%';

      return `<div style="--value: ${value}" data-tooltip="${tooltip}"></div>`;
    }).join('');
    const val = this.formatHeading(this.value);
    const extraClass = (this.data.length === 0) ? 'column-chart_loading' : '';

    let html = `<div class="dashboard__chart_${this.label} ${extraClass}">
                          <div class="column-chart" style="--chart-height: ${this.chartHeight}">
                            <div class="column-chart__title">
                              Total ${this.label}
                              ${linkElement}
                            </div>
                            <div class="column-chart__container">
                              <div data-element="header" class="column-chart__header">${val}</div>
                              <div data-element="body" class="column-chart__chart">
                                ${data}
                              </div>
                            </div>
                          </div>
                        </div>`;

    const tmpElement = document.createElement('template');
    tmpElement.innerHTML = html.trim();
    this.element = <HTMLElement>tmpElement.firstElementChild;
  }
}
