import { customElement, LitElement, property, TemplateResult, html } from "lit-element";
import { Tab } from './model';

@customElement('remix-tab')
export class RemixTab extends LitElement {
  
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

    <style>
    
    .close {
      float:right;
      display:inline-block;
      padding:0px 4px;
      background:#dee1e6; 
      font-stretch: expanded;
    }
    
    .close:hover {
      float:right;
      display:inline-block;
      padding:0px 4px;
      background:#dee1e6;
      color:#fff;
      cursor: pointer;
      font-stretch: expanded;
    }
    
    .tab {
      width: 80px;
        font-family: Arial;
        font-size: 14px;
        height: 18px;
        padding: 8px 4px 4px 8px;
        background: #dee1e6;
        border-radius: 6px 6px 0px 0px;
        border-color: red;
        overflow: hidden;
        display: inline-block;
        text-overflow: ellipsis;
        margin-left: 0px;
        margin-right: 0px;
    }
    
    .active-tab tab {
      background: #ddd;
    }
    
    </style>

    <div class='tab' title="${this.tab.tooltip}" >
      <img src="${this.tab.icon}" />
      <span>${this.tab.title}</span>
      <span class='close' @click="${this.closeTab}">x</span>
    </div>
  `;
  }
}