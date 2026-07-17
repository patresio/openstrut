/**
 * Interactive menu for CLI selection (Node readline, no deps).
 * Pure helpers exported for tests; runMenu() for interactive use.
 */

import readline from 'node:readline';

/**
 * @param {Array<{ id: string, name: string, description: string }>} clis
 * @param {Array<{ installed?: boolean, configExists?: boolean }>} [status]
 */
export function renderMenu(clis, status = []) {
  const lines = ['Select CLI(s) to configure with OpenStrut:', ''];
  clis.forEach((cli, i) => {
    const st = status[i];
    let badge = '';
    if (st) {
      const bits = [];
      if (st.installed) bits.push('installed');
      if (st.configExists) bits.push('config');
      if (bits.length) badge = ` [${bits.join(', ')}]`;
    }
    lines.push(`  ${i + 1}. ${cli.name}${badge}`);
    lines.push(`     ${cli.description}`);
  });
  lines.push('');
  lines.push('Enter number(s) comma-separated, "all", or "q" to quit.');
  return lines.join('\n');
}

/**
 * @param {string} input
 * @param {Array<{ id: string }>} clis
 * @returns {string[]} selected ids (empty = quit / none)
 */
export function parseSelection(input, clis) {
  const raw = String(input ?? '').trim().toLowerCase();
  if (!raw || raw === 'q' || raw === 'quit') return [];
  if (raw === 'all' || raw === '*') return clis.map((c) => c.id);

  const parts = raw.split(/[,\s]+/).filter(Boolean);
  const ids = [];
  for (const p of parts) {
    if (!/^\d+$/.test(p)) {
      throw new Error(`Invalid selection: "${p}"`);
    }
    const n = Number(p);
    if (n < 1 || n > clis.length) {
      throw new Error(`Invalid selection: ${n} (range 1-${clis.length})`);
    }
    const id = clis[n - 1].id;
    if (!ids.includes(id)) ids.push(id);
  }
  return ids;
}

/**
 * Interactive prompt. Returns selected CLI ids.
 * @param {Array<{ id: string, name: string, description: string }>} clis
 * @param {object} [opts]
 * @param {NodeJS.ReadableStream} [opts.input]
 * @param {NodeJS.WritableStream} [opts.output]
 * @param {Array} [opts.status]
 * @returns {Promise<string[]>}
 */
export function runMenu(clis, opts = {}) {
  const input = opts.input ?? process.stdin;
  const output = opts.output ?? process.stdout;
  const menu = renderMenu(clis, opts.status);

  return new Promise((resolve, reject) => {
    const rl = readline.createInterface({ input, output });
    output.write(menu + '\n> ');
    rl.question('', (answer) => {
      rl.close();
      try {
        resolve(parseSelection(answer, clis));
      } catch (err) {
        reject(err);
      }
    });
  });
}
