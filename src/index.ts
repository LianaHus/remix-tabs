// Import LitElement base class and html helper function
import {
  LitElement,
  html,
  property,
  customElement,
  TemplateResult,
} from 'lit-element';

interface Tab {
  id: string; // should be unique
  title: string;
  icon: string;
  tooltip: string;
}

function defaultTab(index?: number): Tab {
  return {
    id: index ? index.toString() : "Invalid",
    title: 'New Tab',
    icon: '',
    tooltip: 'A tab'
  }
}

/**
 * Extends the LitElement base class to define the functionality of the custom <remix-tab> element:
 * - Contains a title attribute
 * - Contains an index attribute (?)
 * - Contains an icon
 * - Close button
 */
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

/**
 * Extends the LitElement base class to define the functionality of the custom 'remix-tabs' element.
 *  - Contains an array of tabs as property
 *  - Has an interface to 
 *    - add a tab
 *    - remove a tab
 *  - drag&drop a tab (will be added later)
*/
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
