const { execSync } = require('child_process');
const path = require('path');

const modules = ['auth', 'user', 'product'];

function getJestCommand(module, args = []) {
  const config = {
    moduleFileExtensions: ['js', 'json', 'ts'],
    rootDir: '..',
    testEnvironment: 'node',
    testRegex: `src/modules/${module}/.*\\.spec\\.ts$`,
    transform: {
      '^.+\\.(t|j)s$': 'ts-jest'
    },
    moduleNameMapper: {
      '^src/(.*)$': '<rootDir>/src/$1',
      '^@app/(.*)$': '<rootDir>/src/modules/$1'
    }
  };

  const configPath = path.join(__dirname, `jest-${module}.json`);
  require('fs').writeFileSync(configPath, JSON.stringify(config, null, 2));

  return `jest --config ${configPath} ${args.join(' ')}`;
}

function runTestsInOrder() {
  console.log('Running tests in order...\n');

  modules.forEach(module => {
    console.log(`\nRunning ${module} module tests:`);
    try {
      execSync(getJestCommand(module), {
        stdio: 'inherit',
        env: {
          ...process.env,
          NODE_ENV: 'test'
        }
      });
    } catch (error) {
      console.error(`\n❌ Tests failed in ${module} module`);
      process.exit(1);
    }
    console.log(`\n✅ ${module} module tests passed`);
  });
}

const args = process.argv.slice(2);
if (args.includes('--watch')) {
  const module = args[1] || 'auth';
  if (!modules.includes(module)) {
    console.error(`Invalid module: ${module}. Available modules: ${modules.join(', ')}`);
    process.exit(1);
  }
  execSync(getJestCommand(module, ['--watch']), { stdio: 'inherit' });
} else if (args.includes('--coverage')) {
  modules.forEach(module => {
    execSync(getJestCommand(module, ['--coverage']), { stdio: 'inherit' });
  });
} else {
  runTestsInOrder();
}
