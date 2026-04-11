import type { CmsPage } from "./cmsTypes";

export interface FileNode {
  name: string;
  path: string;
  type: "folder" | "page";
  page?: CmsPage;
  children: FileNode[];
}

/**
 * Builds a nested file tree from flat CMS pages based on their slug paths.
 * e.g. /blog/ai-education-2024 → blog (folder) → ai-education-2024 (page)
 *      /legal/terms → legal (folder) → terms (page)
 *      / → index (page at root)
 */
export function buildFileTree(pages: CmsPage[]): FileNode {
  const root: FileNode = { name: "/", path: "/", type: "folder", children: [] };

  for (const page of pages) {
    const slug = page.slug.startsWith("/") ? page.slug : `/${page.slug}`;
    const segments = slug.split("/").filter(Boolean);

    if (segments.length === 0) {
      // Root page (/)
      root.children.push({
        name: "index",
        path: "/",
        type: "page",
        page,
        children: [],
      });
      continue;
    }

    let current = root;

    // Create folders for all segments except the last
    for (let i = 0; i < segments.length - 1; i++) {
      const seg = segments[i];
      const folderPath = "/" + segments.slice(0, i + 1).join("/");
      let folder = current.children.find((c) => c.type === "folder" && c.name === seg);
      if (!folder) {
        folder = { name: seg, path: folderPath, type: "folder", children: [] };
        current.children.push(folder);
      }
      current = folder;
    }

    // Last segment is the page
    const pageName = segments[segments.length - 1];
    current.children.push({
      name: pageName,
      path: slug,
      type: "page",
      page,
      children: [],
    });
  }

  // Sort: folders first, then pages, alphabetically within each group
  function sortTree(node: FileNode) {
    node.children.sort((a, b) => {
      if (a.type !== b.type) return a.type === "folder" ? -1 : 1;
      return a.name.localeCompare(b.name);
    });
    node.children.forEach(sortTree);
  }
  sortTree(root);

  return root;
}

/**
 * Flattens the tree into a list with depth info for rendering.
 */
export interface FlatNode {
  node: FileNode;
  depth: number;
  isLast: boolean;
  parentPath: string;
}

export function flattenTree(root: FileNode, expandedPaths: Set<string>): FlatNode[] {
  const result: FlatNode[] = [];

  function walk(node: FileNode, depth: number, parentPath: string) {
    for (let i = 0; i < node.children.length; i++) {
      const child = node.children[i];
      const isLast = i === node.children.length - 1;
      result.push({ node: child, depth, isLast, parentPath: node.path });

      if (child.type === "folder" && expandedPaths.has(child.path)) {
        walk(child, depth + 1, child.path);
      }
    }
  }

  walk(root, 0, "/");
  return result;
}

/**
 * Counts pages inside a folder (recursively).
 */
export function countPages(node: FileNode): number {
  if (node.type === "page") return 1;
  return node.children.reduce((sum, c) => sum + countPages(c), 0);
}
