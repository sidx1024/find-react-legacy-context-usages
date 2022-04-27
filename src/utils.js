/**
 *
 * @param {object} node
 * @param {number} [node.start]
 * @param {number} [node.end]
 * @param {string} source
 * @return {*}
 */
function getSource(node, source) {
  return source.slice(node.start, node.end);
}

/**
 *
 * @param {import('@babel/types').ObjectExpression} objectExpression
 * @param {string} filename
 * @return {*}
 */
function getProperties(objectExpression, filename) {
  return objectExpression.properties
    .filter((property) => {
      if (property.type !== 'ObjectProperty') {
        console.warn(
          `Warning: Unsupported property type "${property.type}" in file "${filename}" at line ${property.loc?.start.line}`,
        );
        return false;
      }
      return true;
    })
    .map((property) => {
      return {
        // @ts-ignore
        key: property?.key?.name || '<<unreadable>>',
        // @ts-ignore
        loc: getLocation(property?.key.loc),
      };
    });
}

/**
 *
 * @param {import('@babel/types').SourceLocation} location
 * @return {{ start: object, end: object }}
 */
function getLocation(location) {
  const { start, end } = location;
  return { start, end };
}

/**
 *
 * @param {string} path
 * @param {string} basePath
 * @return {string}
 */
function trimBasePath(path, basePath) {
  const basePathPattern = getRegExp(basePath);
  return path.replace(basePathPattern, '');
}

/**
 * Makes leading and trailing slash in the path optional
 *
 * @param {string} projectRoot
 * @return {RegExp}
 */
function getRegExp(projectRoot) {
  let pattern = projectRoot;

  if (pattern.startsWith('/')) {
    pattern = '/?' + pattern.slice(1);
  }

  if (pattern.endsWith('/')) {
    pattern = pattern + '?';
  } else {
    pattern = pattern + '/?';
  }

  return new RegExp(pattern, 'g');
}

module.exports = {
  getSource,
  getProperties,
  trimBasePath,
};
