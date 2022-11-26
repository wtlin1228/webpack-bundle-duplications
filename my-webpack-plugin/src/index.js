const { createReplaceTable } = require("./create-replace-table");
const { createMemoisedResolveSync } = require("./resolver");
const { deDuplicate } = require("./de-duplicate");

class DeduplicateWebpackPlugin {
  /**
   * @param {Object} options
   * @param {string} options.cacheDir
   * @param {string} options.rootPath
   * @param {'npm'|'yarn'} options.packageManager
   */
  constructor({ cacheDir, rootPath, packageManager }) {
    this.cacheDir = cacheDir;
    this.rootPath = rootPath;
    this.packageManager = packageManager;
  }

  /**
   * @param {Compiler} compiler the webpack compiler instance
   * @returns {void}
   */
  apply(compiler) {
    // TODO: maybe can get resolver from nmf directly?
    const resolveSync = createMemoisedResolveSync({
      ...compiler.options.resolve,
    });

    const { cacheDir, rootPath, packageManager } = this;
    const replaceTable = createReplaceTable({
      cacheDir,
      rootPath,
      packageManager,
      resolveSync,
    });

    compiler.hooks.normalModuleFactory.tap(
      "DeduplicateWebpackPlugin",
      (nmf) => {
        nmf.hooks.beforeResolve.tap(
          "DeduplicateWebpackPlugin",
          (resolveData) => {
            return deDuplicate(resolveData, replaceTable, resolveSync);
          }
        );
      }
    );
  }
}

module.exports = DeduplicateWebpackPlugin;
