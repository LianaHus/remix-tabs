import { customElement, LitElement, property, TemplateResult, html, css } from "lit-element";
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
  ];

  @property({ type: Object })
  public tab: Tab;

  @property({ type: String})
  public active: string;
  
  constructor() {
    super();
  }

  // removing Shadow DOM and using Light DOM instead
  createRenderRoot() {
    return this;
  }

  // Fire a custom event for others to listen to
  private closed() {
    this.dispatchEvent(new CustomEvent('closed', { detail: this.tab.id }));
  }

  private activated() {
    this.dispatchEvent(new CustomEvent('activeChanged', { detail: this.tab.id }));
  }

  /**
   * Implement `render` to define a template for your element.
   *
   * `render` should be provided for any element that uses LitElement as a base class.
   * It will be executed whenever a property on our component changes.
   * `render` must return a lit-html `TemplateResult`.
   */
  render(): TemplateResult {
    const icon =  this.tab.icon ? html`<img src='${this.tab.icon}' />` : "";
    // add some style for active one this.active ;
    return html`
    <style>
      #title {
        flex-direction: row;
        align-items: center;
        padding-left: 4px;
        cursor: default;
        /*to make it unselectable*/
        -webkit-touch-callout: none; /* iOS Safari */
        -webkit-user-select: none;   /* Chrome/Safari/Opera */
        -khtml-user-select: none;    /* Konqueror */
        -moz-user-select: none;      /* Firefox */
        -ms-user-select: none;       /* Internet Explorer/Edge */
        user-select: none;           /* Non-prefixed version, currently supported by any browser but < IE9 */
      }
    </style>

    <div class="tab">
      <div title="${this.tab.tooltip}" >
        ${icon}
        <span id="title" @click="${this.activated}" @ondblclick="${this.activated}">${this.tab.title}</span>
        <span id="close"  @click="${this.closed}">
          <i class="fa fa-times "></i>
        </span>
      </div>
    </div>
  `;
  }
}
