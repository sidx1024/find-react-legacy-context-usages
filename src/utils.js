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
          `Unsupported property type "${property.type}" in file "${filename}" at line ${property.loc?.start.line}`,
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

module.exports = {
  getSource,
  getProperties,
};
