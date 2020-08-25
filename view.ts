type NodeType = VNode | string | number;
type Attributes = { [key: string]: string | Function };

export interface View<State, Actions> {
  (state: State, actions: Actions): VNode;
}

// Virtual DOM
export interface VNode {
  nodeName: keyof ElementTagNameMap;
  attributes: Attributes;
  children: NodeType[];
}

// Create Virtual DOM
// 引数にノード名(タグ名)、属性、子ノードをとる。
// 仮想DOM(VNode)が返却される。
export function h(
  nodeName: keyof ElementTagNameMap,
  attributes: Attributes,
  ...children: NodeType[]
): VNode {
  return { nodeName, attributes, children };
}

// Create 'Real' DOM
// 引数に仮想DOM(VNode)をとる。
// 返却された値をメイン要素にappendChildすることでブラウザにレンダリングされる。
export function createElement(node: NodeType): HTMLElement | Text {
  if (!isVNode(node)) {
    return document.createTextNode(node.toString());
  }

  const el = document.createElement(node.nodeName);
  setAttributes(el, node.attributes);
  node.children.forEach(child => el.appendChild(createElement(child)));

  return el;
}

function isVNode(node: NodeType): node is VNode {
  return typeof node !== "string" && typeof node !== "number";
}

// set Attribute to Target
function setAttributes(target: HTMLElement, attrs: Attributes): void {
  for (let attr in attrs) {
    if (isEventAttr(attr)) {
      const eventName = attr.slice(2);
      target.addEventListener(eventName, attrs[attr] as EventListener);
    } else {
      target.setAttribute(attr, attrs[attr] as string);
    }
  }
}

function isEventAttr(attr: string): boolean {
  // onから始まる属性名はイベントとして扱う
  return /^on/.test(attr);
}
