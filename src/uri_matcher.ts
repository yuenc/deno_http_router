//

interface Tree<T> {
  uri: string | null;
  level: number;
  index: number;
  parent: Tree<T> | null;
  current: string | null;
  matcher: RegExp | null;
  handler: T | null;
  children: Tree<T>[];
}

function findParentTree<T>(
  uriList: string[],
  trees: Tree<T>[],
  index: number,
): Tree<T> | null {
  const current = uriList[index];
  if (current === undefined) {
    return null;
  }
  const areEnd = uriList.length === (index + 2);
  for (const tree of trees) {
    if (tree.current === current) {
      return areEnd
        ? tree
        : findParentTree(uriList, tree.children, index + 1);
    }
  }
  return null;
}

function findTree<T>(
  uriList: string[],
  trees: Tree<T>[],
  index: number,
): Tree<T> | null {
  const current = uriList[index];
  if (current === undefined) {
    return null;
  }
  const nextIndex = index + 1;
  const isLast = uriList.length === nextIndex;

  for (const tree of trees) {
    // console.log(current, isLast, tree.current === current, tree);
    if (
      (tree.matcher === null && tree.current === current) ||
      (tree.matcher !== null && tree.matcher.test(current))
    ) {
      return isLast ? tree : findTree(uriList, tree.children, nextIndex);
    }
  }
  return null;
}

function addTree<T>(
  uriList: string[],
  parentTree: Tree<T>,
  index: number,
): Tree<T> | null {
  const current = uriList[index];
  if (current === undefined) {
    return null;
  }
  const nextIndex = index + 1;
  const tree: Tree<T> = {
    uri: null,
    level: 0,
    index: nextIndex,
    parent: parentTree,
    current: current,
    matcher: partMatcher(current),
    handler: null,
    children: [],
  };
  parentTree.children.push(tree);
  if (uriList.length === nextIndex) {
    return tree;
  }
  return addTree(uriList, tree, nextIndex);
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
  parent: Tree<T> | null = null;
  current: string | null = null;
  matcher: RegExp | null = null;
  handler: T | null = null;
  children: Tree<T>[] = [];

  add(uri: string, handler: T) {
    const uriList = uri.split("/");
    const currentTree = findParentTree(
      uriList,
      this.children,
      0,
    ) ?? this;
    const lastTree = addTree(
      uriList,
      currentTree,
      currentTree.index,
    ) ?? currentTree;
    lastTree.uri = uri;
    lastTree.handler = handler;

    console.log(JSON.stringify(this, ["uri", "current", "matcher", "children"], 2))
  }

  remove(uri: string) {
  }

  find(uri: string): Tree<T> | null {
    return findTree(uri.split("/"), this.children, 0);
  }
}
