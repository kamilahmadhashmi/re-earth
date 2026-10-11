/** @type {import('dependency-cruiser').IConfiguration} */
module.exports = {
  forbidden: [
    {
      name: 'no-circular',
      severity: 'error',
      comment: 'Circular dependencies compromise tree-shaking, testing isolation, and runtime predictability.',
      from: {},
      to: {
        circular: true
      }
    },
    {
      name: 'not-to-deprecated',
      severity: 'warn',
      comment: 'Dependencies to deprecated modules should be avoided.',
      from: {},
      to: {
        dependencyTypes: ['deprecated']
      }
    }
  ],
  options: {
    doNotFollow: {
      path: 'node_modules'
    },
    tsPreCompilationDeps: true,
    tsConfig: {
      fileName: 'tsconfig.json'
    },
    reporterOptions: {
      dot: {
        collapsePattern: 'node_modules/[^/]+'
      }
    }
  }
}
