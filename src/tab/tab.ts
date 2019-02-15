import { customElement, LitElement, property, TemplateResult, html, css } from "lit-element";
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { Tab } from './model';
import { bootstrap, theme } from "../styles";
@customElement('remix-tab')
export class RemixTab extends LitElement {
  
  static styles = [
    css`${bootstrap}`,
    css`${theme}`,
    css`.tab {
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
    }`,
    css`.title {
      display: flex;
      flex-direction: row;
      align-items: center;
      cursor: default;
    }`,
    css`fa-icon {
      height: 14px;
      padding-left: 10px;
      cursor: pointer;
    }`,
  ];

  @property({ type: Object })
  public tab: Tab;

  @property({ type: String, reflect: true })
  public active: string;
  
  constructor() {
    super();
  }
  /*
  createRenderRoot() {
    return this;
  }
*/
  public closeTab() {
    // cleanup and close
    this.tabClosed();
  }
  
  // Fire a custom event for others to listen to
  private tabClosed() {
    this.dispatchEvent(new CustomEvent('tabClosed', { detail: this.tab.id }));
  }

  private tabActivated() {
    this.dispatchEvent(new CustomEvent('tabActivated', { detail: this.tab.id }));
  }

  /**
   * Implement `render` to define a template for your element.
   *
   * `render` should be provided for any element that uses LitElement as a base class.
   * It will be executed whenever a property on our component changes.
   * `render` must return a lit-html `TemplateResult`.
   */
  render(): TemplateResult {
    const icon =  this.tab.icon ?  "<img src='${this.tab.icon}' />" : "";
    // add some style for active one this.active ;
    return html`
    <div class="tab">
      <div class="title" title="${this.tab.tooltip}" >
        ${icon}
        <span @click="${this.tabActivated}">${this.tab.title}</span>
      </div>
      <fa-icon def="${JSON.stringify(faTimes)}" @click="${this.closeTab}"></fa-icon>
    </div>
  `;
  }
}
