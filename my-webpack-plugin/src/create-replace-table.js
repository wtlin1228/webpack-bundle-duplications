const crypto = require("crypto");
const fs = require("fs");
const path = require("path");
const glob = require("fast-glob");
const mkdirp = require("mkdirp");

/** @typedef {import("../declarations").ResolveSync} ResolveSync */
/** @typedef {import("../declarations").ReplaceTable} ReplaceTable */

const CACHE_BUST = 1;

/**
 * node_modules\/**\/node_modules\/**\/package.json pattern is a duplicate,
 * we don't really need root-level packages
 * @param {string} pkg path of package.json
 * @returns {boolean} whether the path contains at least two `node_modules`
 */
const filterOnlyDuplicates = (pkg) => {
  return pkg.split(path.sep).filter((p) => p === "node_modules").length > 1;
};

/**
 * check whether it's a "proper" package, you'd be surprised how many weird `package.json` out there
 * @param {string?} name name
 * @param {string?} version version
 * @param {string?} dependencies dependencies
 * @returns {boolean} is proper package
 */
const isProperPackage = (name, version, dependencies) => {
  return name && version && dependencies;
};

/**
 * For example:
 * ```
 * acc = {
 *   'debug@2.6.9': [
 *     '<rootPath>/node_modules/body-parser/node_modules/debug',
 *     '<rootPath>/node_modules/compression/node_modules/debug',
 *     '<rootPath>/node_modules/express/node_modules/debug',
 *     '<rootPath>/node_modules/finalhandler/node_modules/debug',
 *     '<rootPath>/node_modules/send/node_modules/debug',
 *     '<rootPath>/node_modules/serve-index/node_modules/debug'
 *   ],
 * }
 * ```
 * @param {Record<string,string[]>} acc accumulator for duplicated packages
 * @param {string} curr file path for package.json
 * @returns {Record<string,string[]>} accumulator for duplicated packages
 */
const reduceDuplicates = (acc, curr) => {
  let json = {};

  try {
    json = JSON.parse(fs.readFileSync(path.resolve(curr)).toString());
  } catch (e) {
    // console && console.error && console.error('Something went wrong while parsing package.json', p, e);
  }

  const { name, version, dependencies } = json;

  if (isProperPackage(name, version, dependencies)) {
    const depName = `${name}@${version}`;

    if (!acc[depName]) {
      acc[depName] = [];
    }
    acc[depName].push(path.parse(curr).dir);
  }

  return acc;
};

/**
 * @param {string[]} packageJsonsByKeyFull list of package.json by key full
 * @param {ResolveSync} resolveSync synchronous resolve function
 * @returns {ReplaceTable} replace table
 */
const generateReplaceTable = (packageJsonsByKeyFull, resolveSync) => {
  const res = {};

  Object.values(packageJsonsByKeyFull).forEach((pathArray) => {
    if (pathArray.length < 2) {
      return;
    }

    const destination = resolveSync(pathArray[0], "");

    for (let i = 1; i < pathArray.length; i++) {
      const resolvedPath = resolveSync(pathArray[i], "");
      res[resolvedPath] = destination;
    }
  });

  return res;
};

/**
 * @param {string} rootPath root path
 * @param {'npm'|'yarn'} packageManager package manager
 * @returns {string} cache key
 */
const getCacheKey = (rootPath, packageManager) => {
  let lockfile;
  if (packageManager === "npm") {
    lockfile = fs.readFileSync(path.resolve(rootPath, "package-lock.json"));
  } else {
    lockfile = fs.readFileSync(path.resolve(rootPath, "yarn.lock"));
  }
  const hash = crypto.createHash("md5");
  hash.update(lockfile);
  return hash.digest("hex");
};

/**
 * @param {Object} options options
 * @param {string} options.rootPath root path
 * @param {string} options.cacheDir cache directory
 * @param {'npm'|'yarn'} options.packageManager package manager
 * @param {ResolveSync} options.resolveSync synchronous resolve function
 * @returns {ReplaceTable} replace table
 */
const createReplaceTable = ({
  rootPath,
  cacheDir,
  packageManager,
  resolveSync,
}) => {
  if (!rootPath && !cacheDir) {
    return;
  }

  mkdirp.sync(cacheDir);
  const cacheKey = getCacheKey(rootPath, packageManager);
  const cacheFileName = path.resolve(
    cacheDir,
    `duplicates-${cacheKey}.${CACHE_BUST}.json`
  );

  if (fs.existsSync(cacheFileName)) {
    return JSON.parse(fs.readFileSync(cacheFileName, "utf8"));
  }

  const packageJsonsByKeyFull = glob
    .sync(`${rootPath}/node_modules/**/package.json`)
    .filter(filterOnlyDuplicates)
    .sort()
    .reduce(reduceDuplicates, {});

  const table = generateReplaceTable(packageJsonsByKeyFull, resolveSync);

  fs.writeFileSync(cacheFileName, JSON.stringify(table, null, 2), "utf8");

  return table;
};

module.exports = { createReplaceTable };
