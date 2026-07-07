import fs from 'fs';
import path from 'path';
import { createHash } from 'crypto';
import { execSync } from 'child_process';
import { registerScenario, PASS, FAIL, INCONCLUSIVE, BLOCKED } from '../runner/run.js';

registerScenario({
  id: 'EVAL-001',
  layer: 'deterministic',
  purpose: 'Prove that the packaged artifact installs correctly into a temporary OpenCode config.',
  run: async (context) => {
    const tmpPkg = context.createTempDir('eval001-pkg-');
    const tmpXdg = context.createTempDir('eval001-xdg-');
    const targetDir = path.join(tmpXdg, 'opencode');

    try {
      // 1. Run npm pack to create the tarball
      const packOut = execSync('npm pack --ignore-scripts --pack-destination ' + tmpPkg, {
        cwd: context.repoRoot, encoding: 'utf8'
      });
      const tarballName = packOut.trim().split('\n').pop().trim();
      const tarballPath = path.join(tmpPkg, tarballName);

      if (!fs.existsSync(tarballPath)) {
        return { status: FAIL, reason: 'npm pack failed to produce tarball' };
      }

      // Compute hash and size
      const tarballBuffer = fs.readFileSync(tarballPath);
      const tarballSize = tarballBuffer.length;
      const hash = createHash('sha256').update(tarballBuffer).digest('hex');

      const evidence = [
        `algorithm: sha256`,
        `artifact filename: ${tarballName}`,
        `artifact byte size: ${tarballSize}`,
        `artifact SHA-256: ${hash}`,
        `Packaged installation verified 84 artifacts successfully.`
      ];

      // 2. Extract tarball
      const extractDir = path.join(tmpPkg, 'extracted');
      fs.mkdirSync(extractDir);
      execSync(`tar -xzf ${tarballPath} -C ${extractDir}`);
      const pkgRoot = path.join(extractDir, 'package');

      // 3. Run the installer from the extracted package
      const installerPath = path.join(pkgRoot, 'bin/openstrut.js');
      const installOut = execSync(`node ${installerPath} install --target ${targetDir} --json`, {
        encoding: 'utf8'
      });
      const installRes = JSON.parse(installOut);

      if (installRes.status !== 'ok' || installRes.installed.length !== 84) {
        return { status: FAIL, reason: `Install failed or incorrect count: ${installRes.installed.length}` };
      }

      // 4. Run check
      const checkOut = execSync(`node ${installerPath} check --target ${targetDir} --json`, {
        encoding: 'utf8'
      });
      const checkRes = JSON.parse(checkOut);

      if (checkRes.status !== 'ok' || checkRes.manifestState !== 'valid') {
        return { status: FAIL, reason: `Check failed or manifest invalid. Status: ${checkRes.status}` };
      }

      // 5. Verify exclusions
      if (fs.existsSync(path.join(targetDir, 'references'))) {
        return { status: FAIL, reason: 'References directory was installed' };
      }

      // Cleanup generated tarball (part of cleanup helper usually, but explicitly removing here is safe too)
      fs.unlinkSync(tarballPath);

      return { status: PASS, evidence };
    } catch (e) {
      return { status: FAIL, reason: e.message, evidence: [ e.stdout, e.stderr ] };
    }
  }
});
