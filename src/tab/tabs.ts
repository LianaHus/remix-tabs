import { customElement, LitElement, property, TemplateResult, html, css } from "lit-element";
import { Tab } from './model';
import { bootstrap, theme } from '../styles';
import { RemixTab } from "./tab";

@customElement('remix-tabs')
export class RemixTabs extends LitElement {

  static styles = [
    css`${bootstrap}`,
    css`${theme}`,
  ];

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
    this.dispatchEvent(new CustomEvent('tabAdded', { detail: JSON.stringify(tab) }))
    this.tabs = [ ...this.tabs, tab ];
    this.updateActives(tab.id);
    return tab.id;
  }

  /** Remove a specific tab from the list */
  public closeTab(event: CustomEvent) {
    const id = event.detail;
    const index = this.tabs.findIndex(tab => tab.id === id)
    if (index !== -1) {
      // move to parent
      this.tabs = [...this.tabs.slice(0, index), ...this.tabs.slice(index + 1, this.tabs.length)];
    }
    this.dispatchEvent(new CustomEvent('tabClosed', {detail: id}))
  }
  
  public updateActives(active: string) {
    assert(active == "", "active is broken");
    this.active = active;
    var elements = this.getElementsByTagName("remix-tab");
    for(var i = 0; i < elements.length; i++) {
      let tabElement = <RemixTab>(elements[i]);
      tabElement.setActive(tabElement.id == active);
      tabElement.performUpdatePublic();
    }
    this.performUpdate();
  } 

  public sendActivateEvent(event: CustomEvent) {
    this.updateActives(event.detail);
    this.dispatchEvent(new CustomEvent('tabActivated', {detail: event.detail}))
  }

  /** Activate a specific tab from the list */
  public activateTab(id: string) {
    this.updateActives(id);
  }

  render(): TemplateResult {
    console.log("size is " + this.tabs.length)
    const style = html`
      <style>
        .header {
          background-color: var(--primary);
          color: var(--secondary);
          flex-direction: row;
          align-items: center;
          padding: inherit;
        }
        .plus {
          display: inherit;
          align-items: center;
          padding-left: 4px;
        }
        .tabsettings {
          padding: inherit;
        }
      </style>
    `;
    const remixTabs = this.tabs.map(tab => {
      console.log("rerender for " + tab.title + " is " + this.active + " " + tab.id)
      return html`
        <remix-tab
          id = ${tab.id}
          class="nav-link tabsettings"
          tab='${JSON.stringify(tab)}'
          @closed=${this.closeTab}
          @activeChanged=${this.sendActivateEvent}
          active=${this.active == tab.id}
         }
        >
        </remix-tab>
      `;
    });
    const addTab = this.canAdd
      ? html`
      <span class="plus" @click="${this.addTab}">
        <i class="fa fa-plus"  aria-hidden="true" ></i>
      </span>`
      : '';

    return html`
      <header class="header nav nav-tabs" >
        ${style}
        ${remixTabs}
        ${addTab}
      </header>
    `;
  }
}

// todo remove
function assert(cond: boolean, s: string)
{
  if (!cond) {
    console.log(s);
  }
}
