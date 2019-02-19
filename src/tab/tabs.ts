import { customElement, LitElement, property, TemplateResult, html, css } from "lit-element";
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { Tab } from './model';
import { bootstrap, theme } from '../styles';

@customElement('remix-tabs')
export class RemixTabs extends LitElement {

  static styles = [
    css`${bootstrap}`,
    css`${theme}`,
    css`header {
      display: flex;
      flex-direction: row;
      align-items: center;
    }`,
    css`.icon {
      margin-left: 10px;
      height: 25px;
      width: 25px;
      cursor: pointer;
    }`,
    css`fa-icon {
      height: 50%;
    }`,
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
/*
  constructor() {
    super();
  }

  createRenderRoot() {
    return this;
  }*/

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
    this.tabs = [ ...this.tabs, tab ];
    this.dispatchEvent(new CustomEvent('tabAdded', { detail: JSON.stringify(tab) }))
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

  /** Activate a specific tab from the list */
  public activateTab(id: string) {
    this.active = id;
  }

  render(): TemplateResult {
    const remixTabs = this.tabs.map(tab => {
      return html`
        <remix-tab
          class="nav-link"
          tab='${JSON.stringify(tab)}'
          @closed=${this.closeTab}
          @selectedChanged=${this.dispatchEvent(new CustomEvent('tabActivated', {detail: tab.id}))}
          active="${this.active === tab.id ? 'true' : 'false'}"
         }
        >
        </remix-tab>
      `;
    });
    const addTab = this.canAdd
      ? html`
      <span class="icon" @click="${this.addTab}">
        <fa-icon def='${JSON.stringify(faPlus)}'></fa-icon>
      </span>`
      : '';

    return html`
      <header class="nav nav-tabs">
        ${remixTabs}
        ${addTab}
      </header>
    `;
  }
}
