import { customElement, LitElement, property, TemplateResult, html } from "lit-element";
import { Tab, defaultTab } from './model';

@customElement('remix-tabs')
export class RemixTabs extends LitElement {

  @property({ type: Array, reflect: true })
  public tabs: Partial<Tab>[] = [];

  /** Add a tab locally */
  public addTab() {
    const tab = defaultTab(this.tabs.length);
    this.tabs = [ ...this.tabs, tab ];
  }

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
    <div class='tab-container'>
      <label>${this.tabs.length}</label>
      ${remixTabs}
      <button @click="${this.addTab}">+</button>
    </div>
    `;
  }
}