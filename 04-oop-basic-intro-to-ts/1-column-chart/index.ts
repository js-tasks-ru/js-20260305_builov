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

  public element: object | null = null;
  private chartHeight: number = 50;

  update(data: number[]) {

  }

  remove() {

  }

  destroy() {

  }

  // @ts-ignore
  constructor({
                data,
                label,
                value,
                link,
                formatHeading
              }: Options = {}) {

    this.data = data;
    this.label = label;
    this.value = value;
    this.link = link;
    this.formatHeading = formatHeading;

    this.setElement();
    // console.log(link);
  }

  private setElement(): void {
    let maxValue: number = 0;
    this.data.forEach(function(item: number, index: number, array: number[]) {
      maxValue = (item > maxValue) ? item : maxValue;
    });

    const scale: number = 50 / maxValue;

    let html = `<div class="dashboard__chart_${this.label}">
                          <div class="column-chart" style="--chart-height: 50">
                            <div class="column-chart__title">
                              Total ${this.label}`;

    if (this.link !== undefined) {
      html += `               <a href="${this.link}" class="column-chart__link">View all</a>`;
    }

    html += `               </div>
                            <div class="column-chart__container">
                              <div data-element="header" class="column-chart__header">${this.value}</div>
                              <div data-element="body" class="column-chart__chart">`;

    this.data.forEach(function(item: number, index: number, array: number[]) {
      const value: number = Math.floor(item * scale);
      const tooltip: string = (item / maxValue * 100).toFixed(0) + '%';

      html += `                 <div style="--value: ${value}" data-tooltip="${tooltip}"></div>`;
    });

    html += `                 </div>
                            </div>
                          </div>
                        </div>`;

    const tmpElement = document.createElement('div');
    tmpElement.innerHTML = html;
    this.element = tmpElement.firstElementChild;
  }
}
