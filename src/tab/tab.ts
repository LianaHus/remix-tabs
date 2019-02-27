import { customElement, LitElement, property, TemplateResult, html, css } from "lit-element";
import { Tab } from './model';
import { bootstrap, theme } from "../styles";
@customElement('remix-tab')
export class RemixTab extends LitElement {
  
  static styles = [
    css`${bootstrap}`,
    css`${theme}`
  ];

  @property({ type: Object})
  public tab: Tab;

  @property({ type: Boolean})
  public active: boolean = false;
  
  constructor() {
    super();
  }

  attributeChangedCallback(name, oldval, newval) {
    console.log('attribute of ' + this.id + ' change: ', "name is " + name, " new is " + newval, " old is " + oldval);
    super.attributeChangedCallback(name, oldval, newval);
  }

  performUpdatePublic() {
    this.performUpdate();
  }

  setActive(value: boolean) {
    this.active = value;
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
   // this.active = true;
    this.dispatchEvent(new CustomEvent('activeChanged', { detail: this.tab.id, bubbles: true, composed: true}));
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
    console.log("tab render for " + this.tab.title + " is " + this.active)
    return html`
    <style>
      .title {
        flex-direction: row;
        padding: inherit;
        align-items: center;
        padding-left: 4px;
        padding-right: 4px;
        cursor: default;
        /*to make it unselectable*/
        -webkit-touch-callout: none; /* iOS Safari */
        -webkit-user-select: none;   /* Chrome/Safari/Opera */
        -khtml-user-select: none;    /* Konqueror */
        -moz-user-select: none;      /* Firefox */
        -ms-user-select: none;       /* Internet Explorer/Edge */
        user-select: none;           /* Non-prefixed version, currently supported by any browser but < IE9 */
      }
      .active {
        background-color: var(--secondary);
        color: var(--primary);
      }
      .inactive {
        background-color: var(--primary);
        color: var(--secondary);
      }
      .tab {
        display: flex;
        flex-direction: row;
        align-items: center;
        padding: inherit;
      }
      .close {
        padding-left: 4px;
        padding-right: 4px;
        size: 0.5m;
      }
    </style>

    <div class="${this.active ? 'tab active' : 'tab inactive'}" title="${this.tab.tooltip}" >
      ${icon}
      <span class="title" @click="${this.activated}">${this.tab.title}</span>
      <span class="close"  @click="${this.closed}">
        <i class="fa fa-times "></i>
      </span>
    </div>
  `;
  }
}

// todo remove
function assert(cond: boolean, s: string)
{
  if (cond) {
    console.log(s);
  }
}