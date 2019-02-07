import { customElement, LitElement, property, TemplateResult, html, css } from "lit-element";
import { Tab, defaultTab } from './model';

@customElement('remix-tabs')
export class RemixTabs extends LitElement {

  static styles = [
    css`:host {
      display: flex;
      flex-direction: row;
      align-items: center;
    }`,
    css`button {
      margin-left: 10px;
      height: 25px;
      width: 25px;
      border-radius: 50%;
      border: none;
      cursor: pointer;
      box-shadow: 0 0 2px rgb(50, 50, 50);
    }`,
    css`button:hover {
      box-shadow: 0 0 3px rgb(50, 50, 50);
    }`
  ];

  @property({ type: Array, reflect: true })
  public tabs: Partial<Tab>[] = [];

  @property({ type: Array, reflect: true })
  public activated: string;

  /** Add a tab to the list */
  public addTab() {
    const tab = defaultTab(this.tabs.length);
    this.tabs = [ ...this.tabs, tab ];
  }

  /** Remove a specific tab from the list */
  public removeTab({ detail: id }: CustomEvent) {
    const index = this.tabs.indexOf(id);
    this.tabs = [...this.tabs.slice(0, index), ...this.tabs.slice(index, this.tabs.length - 1)];
    // send message to the parent to remove one tab and update the property
  }

  render(): TemplateResult {
    const remixTabs = this.tabs.map(tab => {
      return html`<remix-tab tab='${JSON.stringify(tab)}' @tabClosed=${e => this.removeTab(e)}></remix-tab`;
    });
    return html`
      ${remixTabs}
      <button @click="${this.addTab}">+</button>
    `;
  }
}