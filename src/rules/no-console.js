const disallowedMethods = ['log', 'info', 'table', 'dir', 'warn', 'error'];

function looksLike(a, b) {
  return (
    a &&
    b &&
    Object.keys(b).every(bKey => {
      const bVal = b[bKey];
      const aVal = a[bKey];
      if (typeof bVal === 'function') {
        return bVal(aVal);
      }
      return isPrimitive(bVal) ? bVal === aVal : looksLike(aVal, bVal);
    })
  );
}

function isPrimitive(val) {
  return val == null || /^[sbn]/.test(typeof val);
}

module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'disallow use of console',
      category: 'Best Practices',
      recommended: true
    },
    schema: [
      {
        type: 'object',
        properties: {
          allowedMethods: {
            type: 'array',
            items: {
              enum: ['log', 'info', 'table', 'dir', 'warn', 'error']
            },
            minItems: 1,
            uniqueItems: true
          }
        }
      }
    ]
  },
  create: context => {
    const config = context.options[0] || {};
    const allowedMethods = config.allowedMethods || [];

    return {
      Identifier: node => {
        const isConsoleCall = looksLike(node, {
          name: 'console',
          parent: {
            type: 'MemberExpression',
            parent: { type: 'CallExpression' },
            property: {
              name: val =>
                !allowedMethods.includes(val) && disallowedMethods.includes(val)
            }
          }
        });
        if (!isConsoleCall) return;

        context.report({
          node: node.parent.property,
          message: 'Use of console is not allowed'
        });
      }
    };
  }
};
