/**
 * Topological sort for the Change Execution Manifest task list.
 *
 * Produces a deterministic ordering:
 *   1. Dependency graph order (dependencies before dependents).
 *   2. Within the same topological level, tasks are sorted alphabetically by ID.
 *
 * Throws with a BLOCKED error string on cycles or self-dependencies.
 */

/**
 * @typedef {{ id: string, dependsOn: string[] }} SortableTask
 */

/**
 * Topologically sorts tasks. Tasks at the same level (same depth in the DAG)
 * are sorted alphabetically by ID to ensure determinism.
 *
 * @param {SortableTask[]} tasks
 * @returns {SortableTask[]} Sorted tasks.
 * @throws {Error} If a cycle or self-dependency is detected.
 */
export function topoSort(tasks) {
  // Self-dependency check (catches the simple case before DFS)
  for (const task of tasks) {
    if (task.dependsOn.includes(task.id)) {
      throw new Error(`BLOCKED — SELF DEPENDENCY: task "${task.id}" depends on itself`);
    }
  }

  const idToTask = new Map(tasks.map(t => [t.id, t]));
  // in-degree: number of dependencies each task has (among tasks in the list)
  const inDegree = new Map(tasks.map(t => [t.id, 0]));
  // adjacency: dependents of each task (reverse edge)
  const dependents = new Map(tasks.map(t => [t.id, []]));

  for (const task of tasks) {
    for (const dep of task.dependsOn) {
      if (!idToTask.has(dep)) continue; // unknown deps already caught by validate
      inDegree.set(task.id, (inDegree.get(task.id) ?? 0) + 1);
      dependents.get(dep).push(task.id);
    }
  }

  // Kahn's algorithm with sorted queue for determinism
  const result = [];
  // Start with all tasks that have no dependencies (in-degree 0)
  let queue = tasks
    .filter(t => inDegree.get(t.id) === 0)
    .map(t => t.id)
    .sort();

  while (queue.length > 0) {
    // Process all tasks at the current level in sorted order
    const levelIds = [...queue].sort();
    queue = [];

    for (const id of levelIds) {
      result.push(idToTask.get(id));
      // Decrement in-degree of dependents
      const nextBatch = [];
      for (const depId of (dependents.get(id) ?? [])) {
        const newDeg = (inDegree.get(depId) ?? 1) - 1;
        inDegree.set(depId, newDeg);
        if (newDeg === 0) {
          nextBatch.push(depId);
        }
      }
      queue.push(...nextBatch);
    }
  }

  // If not all tasks were processed, there is a cycle
  if (result.length < tasks.length) {
    const remaining = tasks.filter(t => !result.find(r => r.id === t.id));
    const ids = remaining.map(t => t.id).join(', ');
    throw new Error(`BLOCKED — CYCLIC DEPENDENCY: cycle detected among tasks: ${ids}`);
  }

  return result;
}
