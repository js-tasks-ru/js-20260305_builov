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
  private data: SortableTableData[] | undefined;
  private sorted: SortableTableSort | undefined;
  private isSortLocally: boolean | undefined;

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

    this.tableElement.querySelector('[data-element="header"]')?.addEventListener('click', e => {
      const element = e.target as HTMLElement;
      const dataset = (element.closest(".sortable-table__cell") as HTMLElement)?.dataset;

      const column = this.headersConfig.find(item => item.id === dataset?.id);
      if (!column?.sortable) {
        return;
      }

      const id = dataset?.id;
      if (!id) {
        return;
      }

      const order = (dataset.order === 'desc') ? 'asc' : 'desc';

      this.sorted = {
        id: id,
        order: order
      }

      this.sort();
    });
  }


  private buildTableElement(): HTMLElement {
    const header = this.buildTableHeader();
    const body = this.buildTableBody();

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


  private buildTableHeader() {
    return this.headersConfig
      .map(header => {
        let arrow = '';
        if (this.sorted?.id === header.id) {
          arrow = `<span data-element="arrow" class="sortable-table__sort-arrow">
                      <span class="sort-arrow"></span>
                    </span>`;
        }

        return `<div class="sortable-table__cell" data-id="${header.id}" data-sortable="${header.sortable}" data-order="${this.sorted?.order}">
                    <span>${header.title}</span>
                    ${arrow}
                 </div>`
      }).join('');
  }


  private buildTableBody() {
    let body = '';
    if (this.data) {
      body = this.data.map(item => {
        const cells = this.headersConfig.map(header => {
          const value = item[header.id];
          return header.template ? header.template(value) : `<div class="sortable-table__cell">${value}</div>`;
        }).join('');
        return `<a href="/products/${item.id}" class="sortable-table__row">${cells}</a>`;
      }).join('');
    }

    return body;
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
    const sortBy = this.headersConfig.find(h => h.id === this.sorted?.id);
    const sortType = sortBy?.sortType || 'string';

    if (this.data) {
      this.data.sort((a, b) => {
        const aVal = a[this.sorted!.id];
        let bVal = b[this.sorted!.id];

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

        return this.sorted?.order === 'asc' ? result : -result;
      });
    }

    this.updateTable();
  }

  private sortOnServer() {

  }

  private updateTable() {
    if (!this.tableElement) {
      return;
    }

    const header = this.buildTableHeader();
    const body = this.buildTableBody();

    // console.log(header);

    if ("querySelector" in this.tableElement) {
      this.tableElement.querySelector(".sortable-table__header")!.innerHTML = header;
      this.tableElement.querySelector(".sortable-table__body")!.innerHTML = body;
    }

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
