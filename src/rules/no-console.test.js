const { RuleTester } = require('eslint');
const rule = require('./no-console');

const ruleTester = new RuleTester();
ruleTester.run('no-console', rule, {
  valid: [
    'info()',
    'console()',
    'foo.console()',
    'console.baz()',
    'console.log',
    { code: 'console.warn()', options: [{ allowedMethods: ['warn'] }] }
  ],
  invalid: [
    invalid('console.log()'),
    invalid('console.info()'),
    invalid('console.warn()')
  ]
});

function invalid(code) {
  return {
    code,
    errors: [{ message: 'Use of console is not allowed' }]
  };
}
