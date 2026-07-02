/**
 * Parsers for workflow definitions in YAML.
 *
 * parseWorkflow(src): parses a workflow YAML string.
 *   Returns a workflow object with name, description, steps.
 *   Returns null if name is missing or YAML is malformed.
 *
 * parseWorkflowSteps(stepList): normalizes step array.
 *   Returns an array of step objects with name, command, and optional fields.
 *   Returns empty array if stepList is null/undefined.
 *
 * Neither function modifies files. No external dependencies.
 */

/**
 * @typedef {{
 *   name: string,
 *   description?: string,
 *   steps: Array<{
 *     name: string,
 *     command: string,
 *     description?: string,
 *     condition?: string,
 *     dependsOn?: string[]
 *   }>
 * }} Workflow
 */

/**
 * Hand-rolled YAML parser for workflow definitions.
 * Supports: scalar key-value, array items (- value), nested lists.
 * Returns parsed object or null if malformed.
 *
 * @param {string} src
 * @returns {Workflow | null}
 */
export function parseWorkflow(src) {
  if (!src || typeof src !== 'string') return null;

  const lines = src.split('\n');
  const result = {};
  let i = 0;
  let currentKey = null;
  let currentList = null;

  while (i < lines.length) {
    const rawLine = lines[i];
    const line = rawLine.trimEnd();

    // Skip empty lines and comments
    if (!line.trim() || line.trim().startsWith('#')) {
      i++;
      continue;
    }

    // Detect indentation level
    const indent = line.match(/^[ \t]*/)[0].length;

    // Top-level key: value (no indentation)
    if (indent === 0) {
      const colonIdx = line.indexOf(':');
      if (colonIdx > 0) {
        const key = line.slice(0, colonIdx).trim();
        const value = line.slice(colonIdx + 1).trim();

        if (currentList && currentKey) {
          result[currentKey] = currentList;
          currentList = null;
        }

        if (value) {
          result[key] = value;
        } else {
          currentKey = key;
          currentList = key === 'steps' ? [] : null;
        }
      }
    } else if (currentKey === 'steps' && line.trim().startsWith('- ')) {
      // Array item: - { name: value } or - name: value
      const itemStr = line.trim().slice(2).trim();

      if (itemStr.startsWith('{') && itemStr.endsWith('}')) {
        // Inline object: {name: step1, command: echo hello}
        try {
          const obj = parseInlineObject(itemStr);
          if (currentList) currentList.push(obj);
        } catch {
          return null;
        }
      } else if (itemStr.includes(':')) {
        // Multi-line: - name: step1
        const colonIdx = itemStr.indexOf(':');
        const objKey = itemStr.slice(0, colonIdx).trim();
        const objVal = itemStr.slice(colonIdx + 1).trim();
        const stepObj = { [objKey]: objVal };

        // Consume continuation lines (indented key: value under this item)
        i++;
        while (i < lines.length) {
          const nextRaw = lines[i];
          const nextLine = nextRaw.trimEnd();
          const nextIndent = nextLine.match(/^[ \t]*/)[0].length;

          if (!nextLine.trim() || nextLine.trim().startsWith('#')) {
            i++;
            continue;
          }

          // If not indented more than the dash, break
          if (nextIndent <= indent) break;

          // If it's a key: value, add it
          const nextColonIdx = nextLine.indexOf(':');
          if (nextColonIdx > 0) {
            const nextKey = nextLine.slice(indent + 2, nextColonIdx).trim();
            const nextVal = nextLine.slice(nextColonIdx + 1).trim();

            if (!nextVal) {
              const listItems = [];
              let j = i + 1;
              while (j < lines.length) {
                const listRaw = lines[j];
                const listLine = listRaw.trimEnd();
                const listIndent = listLine.match(/^[ \t]*/)[0].length;
                if (!listLine.trim() || listLine.trim().startsWith('#')) {
                  j++;
                  continue;
                }
                if (listIndent <= nextIndent) break;
                if (listLine.trim().startsWith('- ')) {
                  listItems.push(listLine.trim().slice(2).trim());
                  j++;
                  continue;
                }
                break;
              }
              stepObj[nextKey] = listItems.length > 0 ? listItems : '';
              i = j - 1;
            } else {
              stepObj[nextKey] = nextVal;
            }
          }

          i++;
        }
        i--;

        if (currentList) currentList.push(stepObj);
      }
    }

    i++;
  }

  // Finalize remaining list
  if (currentList && currentKey) {
    result[currentKey] = currentList;
  }

  // Validate required fields
  if (!result.name || typeof result.name !== 'string') return null;

  return {
    name: result.name,
    description: result.description || '',
    steps: Array.isArray(result.steps) ? result.steps : [],
  };
}

/**
 * Parses inline YAML object like {name: value, key2: value2}.
 * Simple parser for common cases.
 *
 * @param {string} str
 * @returns {object}
 */
function parseInlineObject(str) {
  const obj = {};
  const content = str.slice(1, -1); // Remove { }
  const parts = content.split(',');

  for (const part of parts) {
    const colonIdx = part.indexOf(':');
    if (colonIdx > 0) {
      const key = part.slice(0, colonIdx).trim();
      const value = part.slice(colonIdx + 1).trim();
      obj[key] = value;
    }
  }

  return obj;
}

/**
 * Normalizes and validates workflow steps.
 *
 * @param {any[]} stepList
 * @returns {Array<{name: string, command?: string, agent?: string, skills?: string[], description?: string, condition?: string, dependsOn?: string[]}>}
 */
export function parseWorkflowSteps(stepList) {
  if (!stepList || !Array.isArray(stepList)) return [];

  return stepList.map(step => ({
    name: step.name || '',
    command: step.command || '',
    agent: step.agent || '',
    skills: Array.isArray(step.skills) ? step.skills : undefined,
    description: step.description,
    condition: step.condition,
    dependsOn: Array.isArray(step.dependsOn) ? step.dependsOn : undefined,
  }));
}
