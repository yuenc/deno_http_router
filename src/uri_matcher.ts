//

interface URINode<T> {
  uri: string | null;
  level: number;
  index: number;
  parent: URINode<T> | null;
  current: string | null;
  matcher: RegExp | null;
  handler: T | null;
  children: URINode<T>[];
}

function findURIParentNode<T>(
  uriList: string[],
  nodeList: URINode<T>[],
  index: number,
): URINode<T> | null {
  const current = uriList[index];
  if (current === undefined) {
    return null;
  }
  const areEnd = uriList.length === (index + 2);
  for (const node of nodeList) {
    if (node.current === current) {
      return areEnd
        ? node
        : findURIParentNode(uriList, node.children, index + 1);
    }
  }
  return null;
}

function findURINode<T>(
  uriList: string[],
  nodeList: URINode<T>[],
  index: number,
): URINode<T> | null {
  const current = uriList[index];
  if (current === undefined) {
    return null;
  }
  const nextIndex = index + 1;
  const isLast = uriList.length === nextIndex;

  for (const node of nodeList) {
    // console.log(current, isLast, node.current === current, node);
    if (
      (node.matcher === null && node.current === current) ||
      (node.matcher !== null && node.matcher.test(current))
    ) {
      return isLast ? node : findURINode(uriList, node.children, nextIndex);
    }
  }
  return null;
}

function addURINode<T>(
  uriList: string[],
  parentNode: URINode<T>,
  index: number,
): URINode<T> | null {
  const current = uriList[index];
  if (current === undefined) {
    return null;
  }
  const nextIndex = index + 1;
  const node: URINode<T> = {
    uri: null,
    level: 0,
    index: nextIndex,
    parent: parentNode,
    current: current,
    matcher: partMatcher(current),
    handler: null,
    children: [],
  };
  parentNode.children.push(node);
  if (uriList.length === nextIndex) {
    return node;
  }
  return addURINode(uriList, node, nextIndex);
}

function partMatcher(part: string): RegExp | null {
  if (part[0] === ":") {
    return new RegExp(/.*/);
  }
  return null;
}

export default class UriMatcher<T> {
  uri: string | null = null;
  level: number = 0;
  index: number = 0;
  parent: URINode<T> | null = null;
  current: string | null = null;
  matcher: RegExp | null = null;
  handler: T | null = null;
  children: URINode<T>[] = [];

  add(uri: string, handler: T) {
    const uriList = uri.split("/");
    let currentNode = findURIParentNode(
      uriList,
      this.children,
      0,
    );
    if (currentNode === null) {
      currentNode = this;
    }
    let lastNode = addURINode(
      uriList,
      currentNode,
      currentNode.index,
    );
    if (lastNode === null) {
      lastNode = currentNode;
    }
    lastNode.uri = uri;
    lastNode.handler = handler;

    console.log(
      JSON.stringify(this, ["uri", "current", "matcher", "children"], 2),
    );
  }

  remove(uri: string) {
  }

  find(uri: string): URINode<T> | null {
    return findURINode(uri.split("/"), this.children, 0);
  }
}
