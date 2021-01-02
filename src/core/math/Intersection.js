import Vector2 from "./Vector2.js";

/** Geometrical intersection between 2D shapes */
export default class Intersection {
    /**
     * Test if the given circle is intersecting with the given rectangle
     * @param {*} circle circle to test intersection with
     * @param {*} rect rect to intersect with the given circle
     */
    static intersectCircleToRectangle(circle, rect) {
        return this.isPointInsideRectangle(circle.center, rect)
            || this.intersectCircleToLine(circle, rect.topEdge)
            || this.intersectCircleToLine(circle, rect.rightEdge)
            || this.intersectCircleToLine(circle, rect.bottomEdge)
            || this.intersectCircleToLine(circle, rect.leftEdge);
    }

    /**
     * Test if the given circle is intersecting with the given line.
     * reference: https://stackoverflow.com/questions/1073336/circle-line-segment-collision-detection-algorithm
     * @param {*} circle circle to test intersection with
     * @param {*} line line to intersect with the given circle
     */
    static intersectCircleToLine(circle, line) {
        const ac = Vector2.sub(circle.center, line.initial);
        const ab = Vector2.sub(line.terminal, line.initial);
        const ab2 = Vector2.dot(ab, ab);
        const acab = Vector2.dot(ac, ab);
        let t = acab / ab2;
        t = (t < 0) ? 0 : (t > 1) ? 1 : t;
        // h = ((ab * t) + lineFrom) - circleLocation;
        const h = Vector2.sub(Vector2.sum(Vector2.mulN(ab, t), line.initial), circle.center);
        const h2 = Vector2.dot(h, h);
        return (h2 <= (circle.radius * circle.radius));
    }

    /**
     * Test if the given point is inside bounds of the rectangle in 2D space 
     * @param {Vector2} point point to test in or outside the rectangle
     * @param {*} rect rectangle to test given point with
     * @returns true when the point is inside the rectangle otherwise false
     */
    static isPointInsideRectangle(point, rect) {
        return point.x > rect.topLeft.x
            && point.x < rect.bottomRight.x
            && point.y > rect.topLeft.y
            && point.y < rect.bottomRight.y;
    }
}