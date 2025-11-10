 
const plugin = {
  meta: {
    name: 'eslint-plugin-example',
    version: '1.2.3'
  },
  rules: {
    'data-test': {
      meta: {
        type: 'problem',
        docs: {
          description: 'Require data-test attribute in ESelect, ECalendar, EInput components',
          category: 'Possible Errors',
          recommended: false
        },
        fixable: 'code',
        schema: [] // no options
      },
      create: function (context) {
        const sourceCode = context.getSourceCode();
        const defineDocumentVisitor = sourceCode.parserServices.defineTemplateBodyVisitor;

        if (defineDocumentVisitor) {
          return defineDocumentVisitor({
            VElement(node) {
              const isExosComponent = node.name.startsWith('e-');
              const hasDataTest = node.startTag.attributes.some((attr) => {
                const hasAttr = attr.key.name === 'data-test';
                const hasValue = attr.value?.value;
                return hasAttr && hasValue;
              });

              if (isExosComponent && !hasDataTest) {
                context.report({
                  node,
                  message: `The <${node.name}> component must have a data-test attribute`
                });
              }
            }
          });
        }
        return {};
      }
    }
  }
};

// for ESM
// export default plugin;

// OR for CommonJS
module.exports = plugin;
