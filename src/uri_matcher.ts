//

interface URINode<T = any> {
  uri: string | null;
  level: number;
  index: number;
  parent: URINode<T> | null;
  named: string;
  regexp: RegExp | null;
  segment: string;
  handler: T | null;
  children: URINode<T>[];
}

function findURIParentNode(
  segmentList: string[],
  nodeList: URINode[],
  index: number,
): URINode | null {
  const segment = segmentList[index];
  if (segment === undefined) {
    return null;
  }
  const areEnd = segmentList.length === (index + 2);
  for (const node of nodeList) {
    if (node.segment === segment) {
      return areEnd
        ? node
        : findURIParentNode(segmentList, node.children, index + 1);
    }
  }
  return null;
}

let findURINodeSegmentList: string[];
let findURINodeMatchParams: Record<string, string | undefined | null> = {};
function findURINode(
  nodeList: URINode[],
  index: number,
): URINode | null {
  const segment = findURINodeSegmentList[index];
  if (segment === undefined) {
    return null;
  }
  const nextIndex = index + 1;
  const isLast = findURINodeSegmentList.length === nextIndex;

  let areFound = false;
  for (const node of nodeList) {
    areFound = false;
    if (node.regexp === null) {
      areFound = node.segment === segment;
    } else {
      const matched = segment.match(node.regexp);
      if (matched) {
        areFound = true;
        findURINodeMatchParams[node.named] = matched[0];
      }
    }
    if (areFound) {
      return isLast ? node : findURINode(node.children, nextIndex);
    }
  }

  return null;
}

function addURINode(
  segmentList: string[],
  parentNode: URINode,
): URINode | null {
  const index = parentNode.index;
  const segment = segmentList[index];
  if (segment === undefined) {
    return null;
  }
  const nextIndex = index + 1;
  const node: URINode = {
    uri: null,
    level: 0,
    index: nextIndex,
    parent: parentNode,
    named: "",
    regexp: null,
    segment: segment,
    handler: null,
    children: [],
  };

  if (segment[0] === ":") {
    node.named = segment.substring(1);
    node.regexp = new RegExp(/.*/);
  }

  parentNode.children.push(node);
  if (segmentList.length === nextIndex) {
    return node;
  }
  return addURINode(segmentList, node);
}

interface URIMatcherImpl<T> extends URINode<T> {
}

export default class URIMatcher<T> implements URIMatcherImpl<T> {
  uri = null;
  level = 0;
  index = 1;
  parent = null;
  named = "";
  regexp = null;
  segment = "";
  matcher = null;
  handler = null;
  children = [];

  add(uri: string, handler: T) {
    const segmentList = uri.split("/");
    let currentNode = findURIParentNode(segmentList, [this], 0);
    if (currentNode === null) {
      currentNode = this;
    }
    let lastNode = addURINode(
      segmentList,
      currentNode,
    );
    if (lastNode === null) {
      lastNode = currentNode;
    }
    lastNode.uri = uri;
    lastNode.handler = handler;

    // console.log(
    //   JSON.stringify(
    //     this,
    //     ["uri", "index", "segment", "matcher", "children"],
    //     2,
    //   ),
    // );
  }

  // remove(uri: string) {
  // }

  find(uri: string): URINode<T> | null {
    findURINodeSegmentList = uri.split("/");
    findURINodeMatchParams = {};
    const node = findURINode([this], 0);
    if (node === null) {
      return null;
    }

    // while (node.parent !== null) {
    // }

    console.log(uri, findURINodeMatchParams);
    return {
      ...node,
      parent: null,
    };
  }
}
