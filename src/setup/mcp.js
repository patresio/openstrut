/**
 * Barsa MCP server config snippets per CLI format.
 */

/**
 * Canonical Barsa MCP entry (OpenCode-style).
 * @returns {{ type: string, url: string, enabled: boolean }}
 */
export function barsaMcpEntry() {
  return {
    type: 'remote',
    url: '{env:BARSA_MCP_URL}',
    enabled: true,
  };
}

/**
 * Merge barsa under the CLI's mcpConfigKey into a plain object config.
 * @param {{ mcpConfigKey: string }} cli
 * @param {Record<string, unknown>} config
 */
export function applyMcpConfig(cli, config = {}) {
  const key = cli.mcpConfigKey;
  const existing = (config[key] && typeof config[key] === 'object')
    ? { .../** @type {Record<string, unknown>} */ (config[key]) }
    : {};
  return {
    ...config,
    [key]: {
      ...existing,
      barsa: barsaMcpEntry(),
    },
  };
}

/**
 * Format-specific MCP snippet text (for toml/yaml or display).
 * @param {{ id: string, mcpConfigKey: string, format?: string }} cli
 */
export function formatMcpSnippet(cli) {
  const entry = barsaMcpEntry();
  if (cli.format === 'toml' || cli.id === 'codex') {
    return [
      `[${cli.mcpConfigKey}.barsa]`,
      `type = "${entry.type}"`,
      `url = "${entry.url}"`,
      `enabled = true`,
    ].join('\n');
  }
  if (cli.format === 'yaml' || cli.id === 'hermes') {
    return [
      `${cli.mcpConfigKey}:`,
      `  barsa:`,
      `    type: ${entry.type}`,
      `    url: "${entry.url}"`,
      `    enabled: true`,
    ].join('\n');
  }
  return JSON.stringify({ [cli.mcpConfigKey]: { barsa: entry } }, null, 2);
}
