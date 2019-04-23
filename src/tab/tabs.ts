import { customElement, LitElement, property, TemplateResult, html, css } from "lit-element";
import { Tab } from './model';
import { RemixTab } from "./tab";

@customElement('remix-tabs')
export class RemixTabs extends LitElement {

  @property({ type: Array })
  public tabs: Partial<Tab>[] = [];

  @property({ type: String })
  public active: string;

  @property({ type: String })
  public defaultTitle: string = 'New Tab';

  @property({ type: String })
  public defaultIcon: string = '';

  // enables/disables + button to add new tab
  @property({ type: Boolean })
  public canAdd = true;

  constructor() {
    super();
  }

  // removing Shadow DOM and using Light DOM instead
  createRenderRoot() {
    return this;
  }

  private generateId(): string {
    let i = 1;
    while (this.tabs.find(tab => tab.id === `${this.defaultTitle} ${i}`)) {
      ++i;
    }
    return (`${this.defaultTitle} ${i}`).toString();
  }

  private defaultTab(): Tab {
    const newId = this.generateId();
    return {
      id: newId,
      title: newId,
      icon: this.defaultIcon,
      tooltip: this.defaultTitle
    }
  }

  /**
   * Add a tab to the list.
   * @returns an id of the created tab.
   * */
  public addTab(tab: Tab): string {
    if (tab.id === undefined) {
      tab = this.defaultTab();
    }
    this.tabs = [...this.tabs, tab];
    this.dispatchEvent(new CustomEvent('tabAdded', { detail: JSON.stringify(tab) }))
    this.updateActives(tab.id);
    return tab.id;
  }

   /**
   * removes the tab with given id from the list.
   * @param id of the tab to remove
   * */
  public removeTab(id: string)
  {
    const index = this.tabs.findIndex(tab => tab.id === id)
    if (index !== -1) {
      // move to parent
      this.tabs = [...this.tabs.slice(0, index), ...this.tabs.slice(index + 1, this.tabs.length)];
    }
    //set new active if needed
    if (this.active == id && this.tabs.length > 0) {
      this.updateActives(this.tabs[this.tabs.length-1].id);
    }
    this.updateActives(this.active)
  }

  /** Remove a specific tab from the list */
  private closeTab(event: CustomEvent) {
    this.removeTab(event.detail)
    this.dispatchEvent(new CustomEvent('tabClosed', { detail: event.detail }))
  }

  public updateActives(active: string) {
    this.performUpdate();
    this.active = active;
    var elements = this.getElementsByTagName("remix-tab");
    for (let i = 0; i < elements.length; i++) {
      let tabElement = <RemixTab>(elements[i]);
      if (!tabElement) {
        continue;
      }
      tabElement.active = tabElement.id == active;
      tabElement.performUpdatePublic();
    }
  }

  public sendActivateEvent(event: CustomEvent) {
    this.updateActives(event.detail);
    this.dispatchEvent(new CustomEvent('tabActivated', {detail: event.detail}))
  }

  /** Activate a specific tab from the list */
  public activateTab(id: string) {
    this.updateActives(id);
  }

  //todo remove fix size
  render(): TemplateResult {
    const style = html`
      <style>
        remix-tabs {
          height: 100%;
        }
        .header {
          flex-direction: row;
          display: flex;
          align-items: center;
          height: 100%;
          border-top-left-radius: 3px;
          border-top-right-radius: 3px;
        }
        .plus {
          display: inherit;
          align-items: center;
          padding-left: 4px;
          color: var(--text-light)
        }
        remix-tab {
          margin-right: 1px;
          margin-top: 0px;
          height: 100%;
        }
        .tab {
          display: flex;
          flex-direction: row;
          align-items: center;
          padding-right: 4px;
        }
      </style>
    `;
  
    const remixTabs = this.tabs.map(tab => {
      let cl = tab.id === this.active ?
        'active border-bottom-0 border-dark' :
        'border-0'
      return html`
        <remix-tab
          id = ${tab.id}
          class="nav-item p-1 nav-link ${cl}"
          tab='${JSON.stringify(tab)}'
          @closed=${this.closeTab}
          @activeChanged=${this.sendActivateEvent}
          ${this.active == tab.id ? " active='true'" : "active='false'"}
         }
        >
        </remix-tab>
      `;
    });
    const addTab = this.canAdd
      ? html`
      <span class="plus" @click="${this.addTab}">
        <i class="text-dark fas fa-plus"  aria-hidden="true" ></i>
      </span>`
      : '';

    return html`
      <header class="header nav nav-tabs role="tablist" >
        ${style}
        ${remixTabs}
        ${addTab}
      </header>
    `;
  }
}
