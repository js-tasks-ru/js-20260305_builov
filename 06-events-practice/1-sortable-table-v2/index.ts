import { createElement } from "../../shared/utils/create-element";

type SortOrder = 'asc' | 'desc';

type SortableTableData = Record<string, string | number>;

type SortableTableSort = {
  id: string;
  order: SortOrder;
};

interface SortableTableHeader {
  id: string;
  title: string;
  sortable?: boolean;
  sortType?: 'string' | 'number' | 'custom';
  template?: (value: string | number) => string;
  customSorting?: (a: SortableTableData, b: SortableTableData) => number;
}

interface Options {
  data?: SortableTableData[];
  sorted?: SortableTableSort;
  isSortLocally?: boolean;
}

export default class SortableTable {
  private tableElement: HTMLElement | null;

  private headersConfig: SortableTableHeader[];
  private data: SortableTableData[];
  private sorted: SortableTableSort | undefined;
  private isSortLocally: boolean;

  constructor(headersConfig: SortableTableHeader[] = [], {
    data = [],
    sorted,
    isSortLocally = true
  }: Options = {}) {
    this.headersConfig = headersConfig;
    this.data = data;
    this.sorted = sorted;
    this.isSortLocally = isSortLocally;
    this.tableElement = this.buildTableElement();

    this.tableElement.querySelectorAll('[data-element="header"] > .sortable-table__cell > span').forEach(element => {
      element.addEventListener('click', e => {

        console.log(e.target);
      });
    });
  }


  private buildTableElement(): HTMLElement {
    const header = this.headersConfig
      .map(header => `
                 <div class="sortable-table__cell" data-id="${header.id}" data-sortable="${header.sortable}">
                    <span>${header.title}</span>
                 </div>
      `).join('');

    const body = this.data.map(item => {
      const cells = this.headersConfig.map(header => {
        const value = item[header.id];
        return header.template ? header.template(value) : `<div class="sortable-table__cell">${value}</div>`;
      }).join('');
      return `<a href="/products/${item.id}" class="sortable-table__row">${cells}</a>`;
    }).join('');

    const html = `
    <div data-element="productsContainer" class="products-list__container">
      <div class="sortable-table">
        <div data-element="header" class="sortable-table__header sortable-table__row">
          ${header}
        </div>
        <div data-element="body" class="sortable-table__body">
          ${body}
        </div>
      </div>
    </div>`;

    return createElement(html);
  }


  public get element() {
    return this.tableElement;
  }


  public sort() {
    if (this.isSortLocally) {
      this.sortOnClient();
    } else {
      this.sortOnServer();
    }
  }

  private sortOnClient() {

  }

  private sortOnServer() {

  }
}
