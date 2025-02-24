const { execSync } = require('child_process');
const path = require('path');

const modules = ['auth', 'user', 'product'];

function runTests(pattern, options = {}) {
  console.log(`\nRunning ${options.name || pattern} tests:`);
  try {
    execSync(`jest "${pattern}" --testPathIgnorePatterns=infrastructure`, {
      stdio: 'inherit',
      env: {
        ...process.env,
        NODE_ENV: 'test'
      }
    });
    console.log(`\n✅ ${options.name || pattern} tests passed`);
  } catch (error) {
    console.error(`\n❌ Tests failed in ${options.name || pattern}`);
    process.exit(1);
  }
}

function runTestsInOrder() {
  console.log('Running tests in order...\n');

  modules.forEach(module => {
    runTests(`src/modules/${module}/**/*.spec.ts`, { name: `${module} module` });
  });
}

const args = process.argv.slice(2);
if (args.includes('--watch')) {
  const module = args[1] || 'auth';
  if (!modules.includes(module)) {
    console.error(`Invalid module: ${module}. Available modules: ${modules.join(', ')}`);
    process.exit(1);
  }
  execSync(`jest "src/modules/${module}/**/*.spec.ts" --watch --testPathIgnorePatterns=infrastructure`, { stdio: 'inherit' });
} else if (args.includes('--coverage')) {
  execSync('jest --coverage --testPathIgnorePatterns=infrastructure', { stdio: 'inherit' });
} else if (args[0]) {
  runTests(args[0]);
} else {
  runTestsInOrder();
}
