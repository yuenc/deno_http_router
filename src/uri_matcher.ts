//

export interface URIParams {
  [K: string]: string | undefined;
}

interface URINode {
  uri: string | null;
  level: number;
  index: number;
  parent: URINode | null;
  named: string;
  regexp: RegExp | null;
  segment: string;
  children: URINode[];
  params: URIParams;
}

const EMPTY_OBJ = {};

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
let findURINodeMatchParams: URIParams = {};
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
      console.log(matched)
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
    children: [],
    params: EMPTY_OBJ,
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

export class URIMatcher {
  private root: URINode = {
    uri: null,
    level: 0,
    index: 1,
    parent: null,
    named: "",
    regexp: null,
    segment: "",
    children: [],
    params: EMPTY_OBJ,
  };

  add(uri: string) {
    const segmentList = uri.split("/");
    let currentNode = findURIParentNode(segmentList, [this.root], 0);
    if (currentNode === null) {
      currentNode = this.root;
    }
    let lastNode = addURINode(
      segmentList,
      currentNode,
    );
    if (lastNode === null) {
      lastNode = currentNode;
    }
    lastNode.uri = uri;
    console.log(uri);
    console.log(
      JSON.stringify(
        this.root,
        ["uri", "index", "segment", "regexp", "matcher", "children"],
        2,
      ),
    );
  }

  // remove(uri: string) {
  // }

  find(urlPath: string): Readonly<URINode> | null {
    findURINodeSegmentList = urlPath.split("/");
    findURINodeMatchParams = {};
    const node = findURINode([this.root], 0);
    if (node === null) {
      return null;
    }
    return {
      ...node,
      params: findURINodeMatchParams,
    };
  }
}
