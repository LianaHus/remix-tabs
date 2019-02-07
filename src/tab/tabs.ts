import { customElement, LitElement, property, TemplateResult, html, css } from "lit-element";
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { Tab } from './model';

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
    }`,
    css`fa-icon {
      height: 50%;
    }`,
  ];

  @property({ type: Array, reflect: true })
  public tabs: Partial<Tab>[] = [];

  @property({ type: Array, reflect: true })
  public activated: string;

  @property({ type: String })
  public defaultTitle: string = 'New Tab';

  @property({ type: String })
  public defaultIcon: string = '';

  @property({ type: Boolean })
  public canAdd = true;

  private defaultTab() {
    return {
      id: this.tabs.length.toString(),
      title: this.defaultTitle,
      icon: this.defaultIcon,
      tooltip: this.defaultTitle
    }
  }


  /** Add a tab to the list */
  public addTab() {
    const tab = this.defaultTab();
    this.tabs = [ ...this.tabs, tab ];
  }

  /** Remove a specific tab from the list */
  public removeTab({ detail: id }: CustomEvent) {
    const index = this.tabs.indexOf(id);
    this.tabs = [...this.tabs.slice(0, index), ...this.tabs.slice(index, this.tabs.length - 1)];
    // send message to the parent to remove one tab and update the property
  }

  /**
   * Implement `render` to define a template for your element.
   *
   * `render` should be provided for any element that uses LitElement as a base class.
   * It will be executed whenever a property on our component changes.
   */
  render(): TemplateResult {
    console.log(JSON.stringify(faPlus));
    const remixTabs = this.tabs.map(tab => {
      return html`<remix-tab tab='${JSON.stringify(tab)}' @tabClosed=${e => this.removeTab(e)}></remix-tab>`;
    });
    const addTab = this.canAdd
      ? html`
      <button @click="${this.addTab}">
        <fa-icon def='${JSON.stringify(faPlus)}'></fa-icon>
      </button>`
      : '';
    /**
     * `render` must return a lit-html `TemplateResult`.
     *
     * To create a `TemplateResult`, tag a JavaScript template literal
     * with the `html` helper function:
     */
    return html`
      ${remixTabs}
      ${addTab}
    `;
  }
}