export interface Tab {
  id: string; // should be unique
  title: string;
  icon: string;
  tooltip: string;
}

export function defaultTab(index?: number): Tab {
  return {
    id: index ? index.toString() : "Invalid",
    title: 'New Tab',
    icon: '',
    tooltip: 'A tab'
  }
}