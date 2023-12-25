import { ITransform } from '../global';
import BoundingBox from './collision/BoundingBox';

const defaultBoundary = new BoundingBox(0, 0, 0, 0);

export default class QuadTree<T extends ITransform> {
  /** Physical boundary of this node */
  private readonly boundary: BoundingBox;

  /** Capacity to hold maximum number of items in this node */
  private readonly capacity = 10;

  /** Depth of this node in the tree */
  private readonly level: number;

  /** Maximum depth the tree can split up to */
  private readonly maxLevels = 5;

  /** Child nodes of this node, aka quadrants */
  private nodes: QuadTree<T>[];

  /** Items present in this quadrant */
  private items: T[] = [];

  constructor(boundary = defaultBoundary, level = 0) {
    this.boundary = boundary;
    this.level = level;
  }

  /**
   * Check the quadrants that the item is touching. Having more than 1 incides
   * means item does not fit fully in a single quadrant or touches the boundary
   * of next quadrant
   * @param item item to check what quadrants it is touching
   */
  getIndices(item: T) {
    const { position, scale } = item;
    const startsInTop = position.y <= this.boundary.ym;
    const startsInLeft = position.x <= this.boundary.xm;
    const endsInRight = position.x + scale.x >= this.boundary.xm;
    const endsInBottom = position.y + scale.y >= this.boundary.ym;

    const indices: number[] = [];
    if (startsInTop && endsInRight) {
      indices.push(0);
    }
    if (startsInTop && startsInLeft) {
      indices.push(1);
    }
    if (startsInLeft && endsInBottom) {
      indices.push(2);
    }
    if (endsInRight && endsInBottom) {
      indices.push(3);
    }
    return indices;
  }

  /**
   * Insert one or more items in the tree. If the tree excedes the capacity,
   * it will split and add all objects to their corresponding nodes
   * @param item single or multiple items to add in the tree
   */
  insert(item: T | T[]) {
    if (typeof item === 'undefined') {
      return;
    }
    if (item instanceof Array) {
      for (let i = 0; i < item.length; i++) {
        this.insert(item[i]);
      }
      return;
    }

    // if the node has quadrants then add it respectively
    if (this.nodes?.length) {
      this.insertInNodes(item);
      return;
    }

    this.items.push(item);

    // when node capacity of holding objects has exceeded and maximum depth
    // level of the tree is not reached yet, then split this node and distribute
    // all the items of this node into their respective nodes
    if (this.items.length > this.capacity && this.level < this.maxLevels) {
      if (!this.nodes?.length) {
        this.split();
      }
      for (let i = 0; i < this.items.length; i++) {
        this.insertInNodes(this.items[i]);
      }
      this.items.length = 0;
    }
  }

  /**
   * Fetch all items from the quadrants that the item is touching
   * @param item item to get indices for
   */
  fetch(item: T | null) {
    if (typeof item === 'undefined' || item === null) {
      return [];
    }
    let ret = this.items;
    const indices = this.getIndices(item);
    if (this.nodes?.length) {
      for (let i = 0; i < indices.length; i++) {
        ret = ret.concat(this.nodes[indices[i]].fetch(item));
      }
    }
    const filtered: T[] = [];
    for (let i = 0; i < ret.length; i++) {
      if (ret.indexOf(ret[i]) >= i) {
        filtered.push(ret[i]);
      }
    }
    return filtered;
  }

  /** Clears the quadTree and all nodes of objects */
  clear() {
    this.items.length = 0;
    this.nodes.length = 0;
  }

  /** Split this node into 4 equal size nodes */
  private split() {
    const nextLevel = this.level + 1;
    const b = this.boundary;
    this.nodes = [
      this.createQuadTree(b.xm, b.y, b.widthHalf, b.heightHalf, nextLevel),
      this.createQuadTree(b.x, b.y, b.widthHalf, b.heightHalf, nextLevel),
      this.createQuadTree(b.x, b.ym, b.widthHalf, b.heightHalf, nextLevel),
      this.createQuadTree(b.xm, b.ym, b.widthHalf, b.heightHalf, nextLevel),
    ];
  }

  /**
   * Insert item in the nodes that it is touching
   * @param item item to insert in nodes of the tree
   */
  private insertInNodes(item: T) {
    const indices = this.getIndices(item);
    for (let i = 0; i < indices.length; i++) {
      this.nodes[indices[i]].insert(item);
    }
  }

  // eslint-disable-next-line class-methods-use-this
  private createQuadTree(x: number, y: number, width: number, height: number, level: number) {
    const box = new BoundingBox(x, y, width, height);
    return new QuadTree<T>(box, level);
  }
}
