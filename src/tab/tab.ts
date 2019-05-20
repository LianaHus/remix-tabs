import { customElement, LitElement, property, TemplateResult, html, css } from "lit-element";
import { Tab } from './model';

@customElement('remix-tab')
export class RemixTab extends LitElement {
  
  @property({ type: Object})
  public tab: Tab;

  /**
   * when the property is:
   * null - remove the attribute.
   * undefined - don't change the attribute.
   * Defined and not null - set the attribute to the property value.
   */
  @property({ type: String})
  public active: boolean = false;
  
  constructor() {
    super();
  }

  performUpdatePublic() {
    this.performUpdate();
  }

  // removing Shadow DOM and using Light DOM instead
  createRenderRoot() {
    return this;
  }

  // Fire a custom event for others to listen to
  private closed() {
    this.dispatchEvent(new CustomEvent('closed', { detail: this.tab.id }));
  }

  private activated(event) {
    this.dispatchEvent(new CustomEvent('activeChanged', { detail: this.tab.id}));
  }

  render(): TemplateResult {
    const icon =  this.tab.icon ? html`<img class="image py-1" src='${this.tab.icon}' />` : "";
    return html`
    <style>
      .title {
        flex-direction: row;
        padding: inherit;
        align-items: center;
        padding-right: 8px;
        padding-left: 2px;
        cursor: default;
        /*to make it unselectable*/
        -webkit-touch-callout: none; /* iOS Safari */
        -webkit-user-select: none;   /* Chrome/Safari/Opera */
        -khtml-user-select: none;    /* Konqueror */
        -moz-user-select: none;      /* Firefox */
        -ms-user-select: none;       /* Internet Explorer/Edge */
        user-select: none;           /* Non-prefixed version, currently supported by any browser but < IE9 */
        vertical-align: middle;
      }
      .tab:hover .close{
        visibility: visible
      }
      .active .close {
        visibility: visible
      }
      .close {
        visibility: hidden;
        padding-top: 4px;
        font-size: medium;
      }
      .image {
        width: 16px;
        height: 16px;
      }
    </style>

    <div class="tab" title="${this.tab.tooltip}">
      ${icon}
      <span class="title" @click="${this.activated}">${this.tab.title}</span>
        <span class="close" @click="${this.closed}">
          <i class="text-dark fas fa-times"></i>
      </span>
    </div>
  `;
  }
}
