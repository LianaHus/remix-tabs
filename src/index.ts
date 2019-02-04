// Import LitElement base class and html helper function
import {
  LitElement,
  html,
  property,
  customElement,
  TemplateResult,
} from 'lit-element';

import { EntityStore } from 'remix-store';

interface Tab {
  id: string; // should be unique
  title: string;
  icon: string;
  tooltip: string;
}

function defaultTab(): Tab {
  return {
    id: "Invalid",
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
  
  @property()
  public tab: Tab = defaultTab();
  
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
      <label>${this.tab.title}</label>
      <span class='close' @click="${() => this.closeTab()}">x</span>
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
  private store = new EntityStore<Tab>(
    'tab',
    {
      ids: [],
      actives: [],
      entities: {}
    },
    'id'
  );

  public selected = 0;

  @property()
  public tabs: Tab[] = [];

  constructor() {
    super();    
   
    var aTab: Tab = defaultTab();
   // aTab.id = "Tab id"
   // aTab.title = "First Tab";
   // aTab.tooltip = "First tooltip";
    this.addTab(aTab);
   /* aTab.id = "First Tab id";
    aTab.title = "First tab title";
    aTab.tooltip = "This is my tooltip";
    this.addTab(aTab);*/
  }

  // Handels removeTab event
  public removeTab({detail}: CustomEvent) {
    this.store.remove(detail); // detail is id here
  }

  // Add tab
  public addTab(tab: Tab) {
    if (this.store.hasEntity(tab.id)) {
      tab.id = tab.id.concat("..." + tab.tooltip) // add some logic here to concat from first different symbol to the end
    }
    this.store.add(tab);
    this.show(tab.id);
  }

  // Show existed tab as an active one
  public show(id: string) {
    if (this.store.ids.indexOf(id) !== -1) {
      this.store.deactivate(this.store.actives);
      this.store.activate(id);
    }
  }

  /**
   * Implement `render` to define a template for your element.
   *
   * `render` should be provided for any element that uses LitElement as a base class.
   * It will be executed whenever a property on our component changes.
   */
  render (): TemplateResult {
    /**
     * `render` must return a lit-html `TemplateResult`.
     *
     * To create a `TemplateResult`, tag a JavaScript template literal
     * with the `html` helper function:
     */
    var htm =  html`
    <style>
    .tab-container {
      background: white;
      margin: 0;
      padding: 0;
      max-height: 30px;
      left: 0;
    }    
    </style>

    <div class='tab-container'>
      <label>${this.store.getAll().length}</label>

      ${this.store.getAll().map(tab => html`
        <remix-tab @tabClosed=${(e: CustomEvent) => this.removeTab(e)}></remix-tab>
      `)}
    </div>
    `;
    console.warn('Custom Element has the following html ' + htm.strings);
    return htm;
  }

  /*

      ${this.store.getAll().map(tab => html`
        <remix-tab tab='${tab}' @tabClosed=${(e: CustomEvent) => this.removeTab(e)}></remix-tab>
      `)}

  */
}
