import { customElement, LitElement, property, TemplateResult, html, css } from "lit-element";
import { Tab } from './model';

@customElement('remix-tab')
export class RemixTab extends LitElement {
  
  static styles = [
    css`:host {
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
      background: #dee1e6;
      border-radius: 6px 6px 0px 0px;
      padding: 5px 10px;
    }`,
    css`.title {
      display: flex;
      flex-direction: row;
      align-items: center;
      font-family: Arial;
      font-size: 14px;
    }`,
    css`.close {
      padding-left: 5px;
      cursor: pointer;
    }`,
  ];

  @property({ type: Object })
  public tab: Tab;
  
  constructor() {
    super();
  }
  
  public closeTab() {
    // cleanup and close
    this.tabClosed();
  }
  
  // Fire a custom event for others to listen to
  private tabClosed() {
    this.dispatchEvent(new CustomEvent('tabClosed', { detail: this.tab.id }));
  }

  /**
   * Implement `render` to define a template for your element.
   *
   * `render` should be provided for any element that uses LitElement as a base class.
   * It will be executed whenever a property on our component changes.
   * `render` must return a lit-html `TemplateResult`.
   */
  render(): TemplateResult {
    return html`
    <div class="title" title="${this.tab.tooltip}" >
      <img src="${this.tab.icon}" />
      <span>${this.tab.title}</span>
    </div>
    <span class="close" @click="${this.closeTab}">X</span>
  `;
  }
}