/**
 * Plugin Installer
 * 
 * This module handles installation of OpenTrust plugins for each platform.
 * 
 * @module plugin-installer
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, '..', '..');

/**
 * Plugin configurations for each platform
 * @type {Object}
 */
const PLUGIN_CONFIGS = {
  opencode: {
    name: 'OpenCode',
    pluginDir: '.opencode/plugins',
    pluginFile: 'opentrust.js',
    manifestFile: null,
    sourceDir: '.opencode/plugins',
  },
  claude: {
    name: 'Claude Code',
    pluginDir: '.claude-plugin',
    pluginFile: null,
    manifestFile: 'plugin.json',
    sourceDir: '.claude-plugin',
  },
  codex: {
    name: 'Codex',
    pluginDir: '.codex-plugin',
    pluginFile: 'bootstrap.js',
    manifestFile: 'plugin.json',
    sourceDir: '.codex-plugin',
  },
  hermes: {
    name: 'Hermes-Agent',
    pluginDir: 'plugins/opentrust',
    pluginFile: '__init__.py',
    manifestFile: 'plugin.yaml',
    sourceDir: 'plugins/opentrust',
  },
};

/**
 * Copy directory recursively
 * @param {string} src - Source directory
 * @param {string} dest - Destination directory
 */
function copyDirRecursive(src, dest) {
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }

  const entries = fs.readdirSync(src, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      copyDirRecursive(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

/**
 * Install plugin for a specific platform
 * @param {string} platform - Target platform
 * @param {Object} options - Installation options
 * @returns {Object} Installation result
 */
export function installPlugin(platform, options = {}) {
  const config = PLUGIN_CONFIGS[platform];
  if (!config) {
    return {
      ok: false,
      platform,
      error: `Unsupported platform: ${platform}`,
    };
  }

  const targetDir = options.targetDir || process.cwd();
  const pluginDir = path.join(targetDir, config.pluginDir);
  const sourceDir = path.join(projectRoot, config.sourceDir);

  try {
    // Check if source exists
    if (!fs.existsSync(sourceDir)) {
      return {
        ok: false,
        platform,
        error: `Source directory not found: ${sourceDir}`,
      };
    }

    // Create plugin directory
    if (!options.dryRun) {
      fs.mkdirSync(pluginDir, { recursive: true });
    }

    // Copy plugin files
    if (!options.dryRun) {
      copyDirRecursive(sourceDir, pluginDir);
    }

    return {
      ok: true,
      platform,
      pluginDir,
      dryRun: options.dryRun || false,
      files: getPluginFiles(platform),
    };
  } catch (err) {
    return {
      ok: false,
      platform,
      error: err instanceof Error ? err.message : String(err),
    };
  }
}

/**
 * Get list of plugin files for a platform
 * @param {string} platform - Target platform
 * @returns {string[]} List of plugin files
 */
export function getPluginFiles(platform) {
  const config = PLUGIN_CONFIGS[platform];
  if (!config) {
    return [];
  }

  const sourceDir = path.join(projectRoot, config.sourceDir);
  if (!fs.existsSync(sourceDir)) {
    return [];
  }

  const files = [];
  const entries = fs.readdirSync(sourceDir, { withFileTypes: true });

  for (const entry of entries) {
    if (entry.isDirectory()) {
      const subFiles = getPluginFilesRecursive(path.join(sourceDir, entry.name), sourceDir);
      files.push(...subFiles);
    } else {
      files.push(entry.name);
    }
  }

  return files;
}

/**
 * Get plugin files recursively
 * @param {string} dir - Directory to scan
 * @param {string} baseDir - Base directory for relative paths
 * @returns {string[]} List of files
 */
function getPluginFilesRecursive(dir, baseDir) {
  const files = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    const relativePath = path.relative(baseDir, fullPath);

    if (entry.isDirectory()) {
      files.push(...getPluginFilesRecursive(fullPath, baseDir));
    } else {
      files.push(relativePath);
    }
  }

  return files;
}

/**
 * Get all supported platforms
 * @returns {string[]} List of supported platforms
 */
export function getPlatforms() {
  return Object.keys(PLUGIN_CONFIGS);
}

/**
 * Get plugin configuration for a platform
 * @param {string} platform - Target platform
 * @returns {Object|null} Plugin configuration
 */
export function getPluginConfig(platform) {
  return PLUGIN_CONFIGS[platform] || null;
}

export default {
  installPlugin,
  getPluginFiles,
  getPlatforms,
  getPluginConfig,
  PLUGIN_CONFIGS,
};
