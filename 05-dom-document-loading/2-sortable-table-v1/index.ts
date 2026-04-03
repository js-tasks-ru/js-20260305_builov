import { createElement } from "../../shared/utils/create-element";

type SortOrder = 'asc' | 'desc';

type SortableTableData = Record<string, string | number>;

interface SortableTableHeader {
  id: string;
  title: string;
  sortable?: boolean;
  sortType?: 'string' | 'number';
  template?: (value: string | number) => string;
}

export default class SortableTable {
  private tableElement: HTMLElement | null = null;

  private headersConfig: SortableTableHeader[];
  private data: SortableTableData[];

  constructor(headersConfig: SortableTableHeader[] = [], data: SortableTableData[] = []) {
    this.headersConfig = headersConfig;
    this.data = data;
  }

  public get element() {
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

    this.tableElement = createElement(html);

    return this.tableElement;
  }

  public sort(field: string, order: SortOrder) {
    const header = this.headersConfig.find(h => h.id === field);
    const sortType = header?.sortType || 'string';

    this.data.sort((a, b) => {
      const aVal = a[field];
      let bVal = b[field];

      if (aVal === undefined || aVal === null) {
        return 1;
      }
      if (bVal === undefined || bVal === null) {
        return -1;
      }

      let result = 0;
      if (sortType === 'number') {
        result = (aVal as number) - (bVal as number);
      } else {
        result = String(aVal).localeCompare(String(bVal), ['ru', 'en']);
      }

      return order === 'asc' ? result : -result;
    });

    this.updateTable(field, order);
  }

  private updateTable(field: string, order: SortOrder) {
    if (!this.tableElement) {
      return;
    }

    const bodyElement = this.tableElement.querySelector('[data-element="body"]');
    const headerElement = this.tableElement.querySelector('[data-element="header"]');
    if (!bodyElement || !headerElement) {
      return;
    }

    this.headersConfig.forEach((item) => {
      if (item.id === field) {
        const headerElement = document.querySelector(`[data-id="${field}"]`);

        if (headerElement) {
          headerElement.setAttribute('data-order', order);
          headerElement.innerHTML = `
                  <span>${item.title}</span>
                  <span data-element="arrow" class="sortable-table__sort-arrow">
                    <span class="sort-arrow"></span>
                  </span>`;
        }
      }
    });

    const body = this.data.map(item => {
      const cells = this.headersConfig.map(header => {
        const value = item[header.id];
        return header.template ? header.template(value) : `<div class="sortable-table__cell">${value}</div>`;
      }).join('');
      return `<a href="/products/${item.id}" class="sortable-table__row">${cells}</a>`;
    }).join('');

    bodyElement.innerHTML = body;
  }

  public remove() {
    if (this.tableElement) {
      this.tableElement.remove();
    }
  }

  public destroy() {
    this.remove();

    this.tableElement = null;
  }
}
