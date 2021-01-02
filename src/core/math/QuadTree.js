export default class QuadTree {
    constructor(bounds, level = 0) {
        /** Boundary of the quad tree telling it's starting and ending position */
        this.bounds = bounds || QuadTree._defaultBounds;
        this.bounds.verticalMidpoint = this.bounds.x + this.bounds.width / 2;
        this.bounds.horizontalMidpoint = this.bounds.y + this.bounds.height / 2;

        /** Capacity to hold maximum number of objects in this node */
        this.capacity = 10;

        /** Depth of this node in the tree */
        this.level = level;

        /** Maximum depth the tree can split up tp */
        this.maxLevels = 5;

        /** All the objects present in this node of the tree */
        this.objects = [];

        /** Child nodes of this node */
        this.nodes = [];
    }

    /**
     * Determine which nodes the object belongs to. Having more than 1 incides 
     * means object does not fit fully in a single quadrant or touches the boundary
     * of next quadrant of the tree
     * @param {*} object object having postion and size within the tree
     */
    getIndices(object) {
        const indices = [],
            objPos = object.transform.position,
            objSize = object.transform.scale,
            objStartsInTopSec = objPos.y <= this.bounds.horizontalMidpoint,
            objStartsInLeftSec = objPos.x <= this.bounds.verticalMidpoint,
            objEndsInRightSec = objPos.x + objSize.x >= this.bounds.verticalMidpoint,
            objEndsInBottomSec = objPos.y + objSize.y >= this.bounds.horizontalMidpoint;

        // object has presence in top right quadrant
        if (objStartsInTopSec && objEndsInRightSec) {
            indices.push(0);
        }

        // object has presence in top left quadrant
        if (objStartsInTopSec && objStartsInLeftSec) {
            indices.push(1);
        }

        // object has presence in bottom left quadrant
        if (objStartsInLeftSec && objEndsInBottomSec) {
            indices.push(2);
        }

        // object has presence in bottom right quadrant
        if (objEndsInRightSec && objEndsInBottomSec) {
            indices.push(3);
        }

        return indices;
    }

    /**
     * Insert one or more objects into the quadTree. If the tree excedes the capacity,
     * it will split and add all objects to their corresponding nodes
     * @param {*} object single object or an array objects to insert into tree
     */
    insert(object) {
        if (typeof object === 'undefined') {
            return;
        }
        if (object instanceof Array) {
            for (let i = 0; i < object.length; i++) {
                this.insert(object[i]);
            }
            return;
        }

        if (this.nodes.length) {
            this._insertInNodes(object);
            return;
        }

        this.objects.push(object);

        // when node capacity of holding objects has exceeded and maximum depth 
        // level of the tree is not reached yet, then we split the tree and distribute
        // all the objects of this node into their respective nodes
        if (this.objects.length > this.capacity && this.level < this.maxLevels) {
            if (!this.nodes.length) {
                this._split();
            }
            for (let i = 0; i < this.objects.length; i++) {
                this._insertInNodes(this.objects[i]);
            }
            this.objects = [];
        }
    }

    /**
     * Fetch objects of all the nodes where the given objects has it's indices in
     * @param {*} object object to get indices of
     */
    fetch(object) {
        if (typeof object === 'undefined' || object === null) {
            return [];
        }
        let ret = this.objects;
        const indices = this.getIndices(object);
        if (this.nodes.length) {
            for (let i = 0; i < indices.length; i++) {
                ret = ret.concat(this.nodes[indices[i]].fetch(object));
            }
        }
        let filtered = [];
        for (let i = 0; i < ret.length; i++) {
            if (ret.indexOf(ret[i]) >= i) {
                filtered.push(ret[i]);
            }
        }

        return filtered;
    }

    /** Clears the quadTree and all nodes of objects */
    clear() {
        this.objects = [];
        this.nodes.forEach(node => node.clear());
        this.nodes = [];
    }

    /** Default bounds of the tree/node */
    static _defaultBounds = {
        x: 0,
        y: 0,
        width: 0,
        height: 0
    };

    /** Split this node into 4 equal size nodes */
    _split() {
        const subWidth = this.bounds.width / 2;
        const subHeight = this.bounds.height / 2;
        const nextLevel = this.level + 1;

        this.nodes[0] = new QuadTree({
            x: this.bounds.x + subWidth,
            y: this.bounds.y,
            width: subWidth,
            height: subHeight
        }, nextLevel);

        this.nodes[1] = new QuadTree({
            x: this.bounds.x,
            y: this.bounds.y,
            width: subWidth,
            height: subHeight
        }, nextLevel);

        this.nodes[2] = new QuadTree({
            x: this.bounds.x,
            y: this.bounds.y + subHeight,
            width: subWidth,
            height: subHeight
        }, nextLevel);

        this.nodes[3] = new QuadTree({
            x: this.bounds.x + subWidth,
            y: this.bounds.y + subHeight,
            width: subWidth,
            height: subHeight
        }, nextLevel);
    }

    /**
     * Insert single object in it's corresponding nodes
     * @param {*} object single objects to be inserted into tree
     */
    _insertInNodes(object) {
        const indices = this.getIndices(object);
        for (let i = 0; i < indices.length; i++) {
            this.nodes[indices[i]].insert(object);
        }
    }

}