/**
 *
 * @param {object} node
 * @param {number} [node.start]
 * @param {number} [node.end]
 * @param {string} source
 * @return {*}
 */
export function getSource(node: {
    start?: number | undefined;
    end?: number | undefined;
}, source: string): any;
/**
 *
 * @param {import('@babel/types').ObjectExpression} objectExpression
 * @param {string} filename
 * @return {*}
 */
export function getProperties(objectExpression: import('@babel/types').ObjectExpression, filename: string): any;
/**
 *
 * @param {string} path
 * @param {string} basePath
 * @return {string}
 */
export function trimBasePath(path: string, basePath: string): string;
