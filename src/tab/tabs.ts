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

  // Private properties
  @property({ type: Boolean })
  public isDropdownOpen = false;

  constructor() {
    super();

  /* @Todo Enable and fix this after release
  document.addEventListener('wheel', (e) => {
    if (Math.abs(e.deltaX) + Math.abs(e.deltaY) < 10)
      return

    const delta = e.deltaX > 0
    const tabs = this.querySelectorAll("remix-tab")

    // find first visible element
    let i = 0
    while (i < tabs.length && tabs[i].clientTop === 0) {
      var rect = tabs[i].getBoundingClientRect();
      var viewHeight = this.clientHeight//Math.max(this.clientHeight, window.innerHeight);
      if (!(rect.bottom < 0 || rect.top - viewHeight >= 0)) {
        break
      }
      ++i
    }
    let start = i
    let end = 0
    if (e.deltaY < 0) {
      // check reversed i-> 0 --i
      while (start > end && tabs[start].clientTop === 0) {
        var rect = tabs[start].getBoundingClientRect();
        var viewHeight = this.clientHeight//Math.max(this.clientHeight, window.innerHeight);
        if (rect.bottom < 0 || rect.top - viewHeight >= 0) {
          break
        }
        --start
      }
    } else {
      start = i + 1
      let end = tabs.length - 1
      // check reversed i-> 0 --i
      while (start < end && tabs[start].clientTop === 0) {
        var rect = tabs[start].getBoundingClientRect();
        var viewHeight = this.clientHeight//Math.max(this.clientHeight, window.innerHeight);
        if (rect.bottom < 0 || rect.top - viewHeight >= 0) {
          break
        }
        ++start
      }
    }
    // check delta
    // scroll back => find first hidden from 0-i
    // scroll forward => find first hidden from i-tabs.length
    this.ensureVisible(tabs[start].id)//this.tabs[this.tabs.indexOf(this.active) - 1 || this.tabs.length]
  })
  */
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
    this.updateActiveAll(tab.id);
    this.ensureVisible(tab.id)
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
      this.updateActiveAll(this.tabs[this.tabs.length-1].id);
    }
    this.updateActiveAll(this.active)
  }

  /** Remove a specific tab from the list */
  private closeTab(event: CustomEvent) {
    this.removeTab(event.detail)
    this.dispatchEvent(new CustomEvent('tabClosed', { detail: event.detail }))
  }

  public updateActiveAll(active: string) {
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

  public sendActivateEvent(id: string) {
    this.updateActiveAll(id);
    this.dispatchEvent(new CustomEvent('tabActivated', {detail: id}))
  }

  /** Activate a specific tab from the list */
  public activateTab(id: string) {
    this.updateActiveAll(id);
    this.ensureVisible(id);
  }

  // should be a method to be used with removeEventListener
  onWindowClick = (e: MouseEvent) => {
    const parentTarget = (e.target as HTMLElement).parentElement
    if (!parentTarget || parentTarget.id !== "dropdownMenu") {
      // click is outside of dropdown list
      this.closeDropdown()
    }
  }

  private toggleDropDownList(event: CustomEvent) {
    event.stopPropagation()
    this.isDropdownOpen ?  this.closeDropdown() : this.openDropdown()
  }

  private openDropdown() {
    this.isDropdownOpen = true
    window.addEventListener('click', this.onWindowClick)
  }

  private closeDropdown() {
    this.isDropdownOpen = false
    window.removeEventListener('click', this.onWindowClick);
  }

  private ensureVisible(id: string) {
    const tabElement = this.querySelector("remix-tab[id='" + id + "']")
    if (tabElement) {
      tabElement.scrollIntoView()
    }
  }

  render(): TemplateResult {
    const style = html`
      <style>
        remix-tabs {
          height: 100%;
          position: relative;
          display: flex;
          width: 100%;
          overflow: hidden;
          user-select: none;
        }
        .header {
          flex-direction: row;
          display: flex;
          width: 99%;
          border-top-left-radius: 3px;
          border-top-right-radius: 3px;
          position: relative;
          list-style: none;
          box-sizing: content-box;
          overflow: hidden;
        }
        .plus {
          display: inherit;
          align-items: center;
          padding-left: 4px;
          color: var(--text-light)
        }
        remix-tab {
          margin-right: 1px;
          margin-top: 4px;
        }
        .tab {
          flex-direction: row;
          padding-right: 4px;
        }
        .tabList {
          height: fit-content;
          position: fixed;
          right: 1px;
          top: 2.3em;
          max-height: 90%;
          overflow-y: auto;
        }
        .dropdown {
          right: 0px;
          position: absolute;
          height: 100%;
          z-index: 100;
        }
        .listItems {
        }
      </style>
    `;
  
    const remixTabs = this.tabs.map(tab => {
      let classes = tab.id === this.active ?
        'active border-bottom-0 border-dark' :
        'border-0'
      return html`
        <remix-tab
          id=${tab.id}
          class="nav-item p-1 nav-link ${classes}"
          tab='${JSON.stringify(tab)}'
          @closed=${this.closeTab}
          @activeChanged="${(e)=>{this.sendActivateEvent(e.detail)}}"
          ${this.active == tab.id ? " active='true'" : "active='false'"}
         }
        >
        </remix-tab>
      `;
    });

    const tabNames = this.tabs.map(tab => {
      return html`
        <span
          id="${tab.id}Item"
          class="listItems ${this.active === tab.id ? 'active': ''} list-group-item py-1 list-group-item-action btn"
          @click="${()=>{
            this.ensureVisible(tab.id)
            this.sendActivateEvent(tab.id)
          }}"
        >
          ${tab.title}
        </span>`
    })

    const dropdownMenu = this.isDropdownOpen ? html`
      <ul
        id="dropdownMenu"
        class="bg-light text-dark list-group tabList">
        ${tabNames}
      </ul>
    ` : html``

    const dropdownList = html`
      <div class="dropdown p-1 btn-light" @click="${(e) => this.toggleDropDownList(e)}">
        <span class="dropdownCaret">
          <i class="text-dark fas fa-caret-down" aria-hidden="true"></i>
        </span>
      </div>
    `

    const addTab = this.canAdd
      ? html`
      <span class="plus" @click="${this.addTab}">
        <i class="text-dark fas fa-plus" aria-hidden="true"></i>
      </span>`
      : '';

    return html`
      <header class="header nav nav-tabs role="tablist">
        ${style}
        ${remixTabs}
        ${addTab}
        ${dropdownMenu}
      </header>
      ${dropdownList}
    `;
  }
}
