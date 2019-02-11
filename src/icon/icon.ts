import { customElement, LitElement, property, html, css } from "lit-element";
import { library, icon, findIconDefinition, IconDefinition, Icon } from '@fortawesome/fontawesome-svg-core';


@customElement('fa-icon')
export class FaIcon extends LitElement {

  static styles = [
    css`:host {
      display: inherit;
    }`,
    css`svg {
      height: 100%;
    }`
  ];

  private icon: Icon;

  @property({ type: Object })
  set def(def: IconDefinition) {
    library.add(def);
    const { prefix, iconName } = def;
    const iconDef = findIconDefinition({ prefix, iconName });
    this.icon = icon(iconDef);
    this.requestUpdate('def');
  }

  constructor() {
    super();
  }

  render() {
    return html`${this.icon ? this.icon.node : ''}`;
  }
}