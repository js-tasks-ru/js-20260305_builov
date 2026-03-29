import { createElement } from "../../shared/utils/create-element";

interface Options {
  data?: number[];
  label?: string;
  value?: number;
  link?: string | null;
  formatHeading?: any;
}

export default class ColumnChart {
  private data: number[] | undefined;
  private label: string | undefined;
  private value: number | undefined;
  private link: string | null | undefined;
  private formatHeading: any;

  public element: HTMLElement | null;
  private chartHeight: number = 50;
  private extraClass: string = '';

  update(data: number[]) {

  }

  remove() {

  }

  destroy() {

  }

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
    const maxValue: number = Math.max(...this.data);
    const scale: number = (maxValue !== 0) ? this.chartHeight / maxValue : 0;

    const linkElement = (this.link !== '') ? `<a href="${this.link}" class="column-chart__link">View all</a>` : '';

    let dataElement = null;
    if (this.data) {
      dataElement = this.data.map(function (item: number) {
        const value: number = Math.floor(item * scale);
        const tooltip: string = (item / maxValue * 100).toFixed(0) + '%';

        return `<div style="--value: ${value}" data-tooltip="${tooltip}"></div>`;
      }).join('');
    }

    const val = this.formatHeading(this.value);
    if (this.data) {
      this.extraClass = (this.data.length === 0) ? 'column-chart_loading' : '';
    }

    const html = `<div class="dashboard__chart_${this.label} ${(this.extraClass)}">
                          <div class="column-chart" style="--chart-height: ${this.chartHeight}">
                            <div class="column-chart__title">
                              Total ${this.label}
                              ${linkElement}
                            </div>
                            <div class="column-chart__container">
                              <div data-element="header" class="column-chart__header">${val}</div>
                              <div data-element="body" class="column-chart__chart">
                                ${dataElement}
                              </div>
                            </div>
                          </div>
                        </div>`;

    this.element = createElement(html);
  }
}
