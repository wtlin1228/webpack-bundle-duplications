/** @typedef {import("../declarations").ResolveSync} ResolveSync */
/** @typedef {import("../declarations").ReplaceTable} ReplaceTable */

/**
 * @param {ResolveData} resolveData resolve data from webpack hook
 * @returns {boolean}
 */
const isLoader = (resolveData) => {
  return resolveData.request.startsWith("!");
};

/**
 * @param {string} resolvedResource resolved resource
 * @returns {boolean}
 */
const containsNodeModules = (resolvedResource) => {
  return resolvedResource.includes("node_modules");
};

/**
 * de-duplicate by directly update resolveData.request if this module is replaceable
 * @param {ResolveData} resolveData resolve data from webpack hook
 * @param {ReplaceTable} replaceTable replace table
 * @param {ResolveSync} resolveSync synchronous resolve function
 * @returns {void}
 */
const deDuplicate = (resolveData, replaceTable, resolveSync) => {
  if (!resolveData || isLoader(resolveData)) {
    return undefined;
  }

  const resolvedResource = resolveSync(
    resolveData.request,
    resolveData.context
  );

  if (!resolvedResource || !containsNodeModules(resolvedResource)) {
    return undefined;
  }

  if (replaceTable[resolvedResource]) {
    resolveData.request = replaceTable[resolvedResource];
  }

  return undefined;
};

module.exports = {
  deDuplicate,
};
