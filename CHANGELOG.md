
n.n.n / 2016-06-16
==================

  * Merge pull request #121 from devlucky/feature/disconnect
  * v0.2.0

v0.2.0 / 2016-06-13
===================

  * v0.2.0
  * Implement disconnect feature
  * Merge pull request #120 from devlucky/chore/record_factory_side_effects
  * Ensure Interceptors response doesn't contain record-factory methods
  * Merge pull request #118 from devlucky/bugfix/update_demo
  * Adapt kakapo changes in demos
  * Merge pull request #117 from devlucky/bugfix/not_require_index_module
  * v0.1.4

v0.1.4 / 2016-06-12
===================

  * v0.1.4
  * Dont require index option
  * Merge pull request #115 from devlucky/docs_update

docs_update / 2016-06-12
========================

  * Update docs
  * Merge pull request #109 from devlucky/chore/integration_tests
  * Adapt specs to new response type
  * Remove shared state between tests
  * Improve jQuery coverage
  * Handling body for xhr request
  * Merge remote-tracking branch 'origin/master' into chore/integration_tests
  * Merge pull request #113 from devlucky/relase-0.1.3
  * basic jquery and superagent support
  * Integration specs structure

relase-0.1.3 / 2016-06-08
=========================

  * v0.1.3

v0.1.3 / 2016-06-08
===================

  * v0.1.3
  * Update Readme
  * Merge pull request #112 from devlucky/chore/keywords
  * Add keywords and fix table of contents
  * Merge pull request #110 from devlucky/example/dummy
  * Merge remote-tracking branch 'origin/master' into example/dummy
  * Update dummy readme
  * Ignore dist
  * Update Readme
  * Fix entry point for npm package
  * Bower dummy integration
  * Merge pull request #111 from devlucky/chore/bower
  * Add bower support
  * Dummy example draft
  * Merge pull request #106 from devlucky/add_demo_links_to_readmes

add_demo_links_to_readmes / 2016-06-04
======================================

  * Update README
  * Add Demos links to Readme

add / 2016-06-02
================

  * Merge pull request #105 from devlucky/chore/deploy_demo_apps
  * Deploy demo apps to Firebase
  * Merge pull request #91 from devlucky/feature/scenarios
  * fix tests
  * Check that scenarios works with xhr
  * Use helpers instead of 'this'
  * Introduce KakapoRequest
  * Merge remote-tracking branch 'origin/master' into feature/scenarios
  * Adapt specs to the new scenario api
  * Intercept requests in the right moment
  * Merge pull request #95 from devlucky/chore/readme-generation
  * Readme autogeneration
  * Merge pull request #94 from devlucky/baseInterceptor/separate-from-strategies
  * Refactor interceptors, so they are not THAT tighly coupled with helpers
  * Make xhrInterceptor a little cleaner, move utils to helpers
  * Remove not needed functions and move from other files
  * Add xhrInterceptor.spec to specs exports
  * Create spec for xhrInterceptor
  * Pass db to request handler
  * Merge pull request #90 from devlucky/chore/add_npm_version_badge
  * Remove disclaimer
  * Relaser setup
  * Merge pull request #88 from devlucky/chore/relaser_integration
  * 0.1.2

v0.1.2 / 2016-05-20
===================

  * 0.1.2
  * Fix current version
  * Merge remote-tracking branch 'origin/master' into chore/relaser_integration
  * Fix build_command
  * [Example] GitHub explorer (#83)
  * Merge pull request #89 from devlucky/oskarcieslik-patch-1
  * Update README.md
  * Merge branch 'master' into chore/relaser_integration
  * Merge pull request #87 from devlucky/patch-1
  * Relaser setup
  * Change entry point in package.json to lib/
  * Merge pull request #84 from devlucky/bugfix/apply_xhr_instance_attributes
  * Merge branch 'master' into bugfix/apply_xhr_instance_attributes
  * Merge pull request #86 from devlucky/oskarcieslik-patch-1-1
  * Update README.md
  * Merge pull request #79 from devlucky/example/todo-app
  * docs(Example/Todo-app): Example app
  * chore(package.json): new build script
  * chore(makefile): New build script
  * chore(project): no dist/ in project
  * feat(todo-app/kakapo-config): Add more generated data
  * feat(todo-app/kakapo-config): Add some faker generated data :zap:
  * Apply all xhr instance properties and methods
  * Merge remote-tracking branch 'origin/master' into example/todo-app
  * Render after destroy todos
  * Merge pull request #82 from devlucky/feature/delete_record
  * Implement record.delete()
  * Delete todo
  * Implement record.delete()
  * Toggle all
  * Update TODO's
  * Merge pull request #80 from devlucky/bugfix/fetch_interceptor_request_url
  * Handle record creation
  * Decorate record on push
  * Support Request url in fetch interceptor
  * Todo app first draft
  * Support Request url in fetch interceptor
  * Merge pull request #76 from devlucky/documentation/util
  * docs(helpers/util): Add documentation for helpers/util
  * Merge pull request #75 from devlucky/documentation/recordFactory
  * docs(database/recordFactory): Add documentation for recordFactory
  * Merge pull request #74 from devlucky/documentation/database
  * Merge branch 'master' into documentation/database
  * docs(database): Fix documentation a bit in style
  * Merge pull request #73 from devlucky/documentation/database
  * docs(database): Create documentation for Database
  * Merge pull request #72 from devlucky/database/refactor-stores
  * test(database): remove unused tests
  * refactor(database/uuidStore): create registration for uuidStore
  * fix(database/find): Fix serialize function call to have collectionName on it
  * style(styling):
  * style(database + recordFactory): styling]
  * test(database): Remove test for factoryFor
  * fix(database/hasMany): hasMany should be in range [1, len(all)]
  * refactor(database/factoryFor|serializerFor): Rename methods to better tell purpose
  * style(database/order): Order methods alphabetically
  * refactor(database/serializers): Separate concerns of serialize & other methods
  * refactor(database/serializers): Separate concerns of serialize & other methods
  * refactor(database/whole): More code removal, better practices implementation
  * refactor(database/uuidStore + database/whole): Move uuid to it's own store. Remove unnecessary metho
  * refactor(database/factoryStore|serializerStore): Move factories and serializers outside of Database
  * refactor(database/store): Move records' store outside of database, replace with weakmaps + maps
  * Merge pull request #71 from devlucky/test/runners--all-specs
  * chore(test/runners): By default let's have runners call ALL specs

v0.0.1 / 2016-05-10
===================

  * Merge pull request #70 from devlucky/project/style-fixes
  * style(serializers/json-api): fixes according to airbnb-javascript guide
  * style(serializers/index): fixes according to airbnb-javascript guide
  * style(router): fixes according to airbnb-javascript guide
  * style(interceptors/xhrInterceptor): fixes according to airbnb-javascript guide
  * style(interceptors/index): fixes according to airbnb-javascript guide
  * style(interceptors/fetchInterceptor): fixes according to airbnb-javascript guide
  * style(interceptors/baseInterceptor): fixes according to airbnb-javascript guide
  * style(helpers/util): fixes according to airbnb-javascript guide
  * style(database/recordFactory): fixes according to airbnb-javascript guide
  * fix(database): Fix missing return statement
  * fix(test/database): fix name change from previous style changes
  * style(database): fixes according to airbnb-javascript guide
  * style(database): fixes according to airbnb-javascript guide
  * Update README.md

v0.0.0 / 2016-05-08
===================

  * Merge pull request #67 from devlucky/database/first-last
  * test(Database/first+last): Add tests for Database.first and Database.last
  * refactor(database/first+last): Add check for presence of factory
  * fix(version): Update npm + github version of package
  * fix(semantic-release): Fix semrel
  * 0.0.0
  * feat(Makefile & semantic-release): Move semantic-release to Makefile & remove npm publish for now
  * feat(Database): Database now have (find + findOne) instead of (find + filter)
  * chore(commitizen): Add run-config for commitizen
  * fix(package.json): Add missing coma
  * chore(semantic-release): Replaced relaser with semantic-release
  * chore(codecov.io): Add codecov again, somehow disappeared?!
  * Merge pull request #65 from devlucky/database/find
  * fix(Fix tests typos):
  * fix(specs/serializers): Fix new database methods
  * refactor(database/find): Change filter method to find
  * refactor(database/findOne): Change find method to findOne
  * chore(package.json): Add script for karma-watch
  * style(specs): Improve specs according to Airbnb's styleguide
  * style(runners/travis): Stop using lodash just for iterating specs
  * style(runners/karma): Improve karma runner
  * style(test/index.html):
  * style(runners/browser): Improve browser runner
  * chore(Makefile): Extract some parts of commands to VARIABLEs
  * chore(Makefile): Replace scripts with Makefile
  * chore(scripts): Remove scripts dir
  * chore(gitignore): Fix coverage dir again
  * chore(test_bundle): Remove test_bundle.js from git
  * chore(gitignore): Fix path to test dir
  * chore(test-coverage): Update reports dir
  * chore(eslint): Update deprecated config. Install config modules
  * chore(editorconfig): Add editor config to project
  * docs(LICENSE): Nicer LICENSE file
  * chore(project): Remove playground
  * chore(project/dist): Remove dist directory
  * chore(webpack): Add loaders to webpack & actually install their npm packages
  * fix(package.json): move some dependencies to dev deps
  * refactor(test): mv tests => test
  * fix(.gitignore): Fix path to test_bundle
  * chore(Add test_bundle to .gitignore):
  * chore(Add npm logs to .gitignore):
  * Merge branch 'master' of github.com:devlucky/Kakapo.js
  * chore(.gitignore): Extend gitignore
  * Merge pull request #60 from devlucky/interceptor/nativeServices
  * refactor(interceptors): Take use of those nativeServices helper.
  * Merge branch 'master' of github.com:devlucky/Kakapo.js
  * Project/refactor structure (#59)
  * refactor(project): Improve project's structure to follow modern node apps
  * refactor(project): Improve project's structure to follow modern node apps
  * Merge branch 'master' of github.com:devlucky/Kakapo.js
  * refactor(interceptors): Improve interceptors structure (#58)
  * refactor(interceptors): Improve interceptors structure
  * Merge pull request #57 from devlucky/database/refactor
  * refactor(specs): Change request delay to 1s for quicker tests
  * fix(package.json): Fix packages versions causing errors in travis-ci
  * fix(database/hasMany): Quick fix for limit of hasMany, this was making our tests fail at random
  * refactor(database/hasMany):
  * style(database/all):
  * refactor(database/hasMany):
  * refactor(database/belongsTo):
  * test(database/nested-find database/nested-filter): Test find / filter with nested conditions.
  * Merge pull request #48 from devlucky/feature/db_relationships
  * Merge remote-tracking branch 'origin/master' into feature/db_relationships
  * Rename last by lastItem
  * Merge pull request #55 from devlucky/database/nested-factories
  * Add tests for nested properties
  * ...
  * Add recursive factory mapping
  * Merge pull request #46 from devlucky/router/requestDelay
  * Merge branch 'master' into router/requestDelay
  * Fix mutability bug
  * Implement Database relationships
  * Merge pull request #41 from devlucky/feature/serializers
  * Serializer improvements
  * Separate router configs, add requestDelay option
  * Return undefined in factoryFor
  * Merge remote-tracking branch 'origin/master' into feature/serializers
  * Fix serializer
  * Update router.js
  * Merge pull request #45 from devlucky/router/additional-options
  * Change undefined to null. Tests using some valid url
  * Add functionality to specify host
  * Add functionality to specify host
  * Don't mutate default config
  * Update README.md
  * New slack team
  * Change ES6 Object's static methods to lodash alternatives
  * Merge pull request #38 from devlucky/database/pass-records-as-copy
  * Serializers draft
  * Better order of parameters
  * Records are now passed as copies
  * Merge pull request #36 from devlucky/database/safer-tests
  * Merge pull request #37 from devlucky/scripts/refactor
  * Fix package.json
  * Move scripts into separate files
  * Run code coverage only on travis
  * Add checks for factory presence to more functions, also tests
  * Make database tests safer
  * Implement record factory for database (#33)
  * Add slack notifications
  * Add codecov coverage
  * Merge pull request #32 from devlucky/response/fix-coverage
  * Tests for response.error and response.ok
  * Refactor error()
  * Merge pull request #31 from devlucky/tests/code-coverage
  * Add code-coverage with automatic codecove.io report
  * Separate tests into modules, also provide workflow just for travis
  * Abstract fakeXMLHttpRequest & fakeFetch functionality (#28)
  * Merge pull request #29 from devlucky/router/refactor-router
  * Remove request, change with register
  * Refactor router just a little
  * Implement database's record population (#21)
  * :tada:
  * Align code with new structure
  * Merge remote-tracking branch 'origin/master' into feature/rich_response_support
  * Add slack to travis
  * typo in scripts
  * Change script names a little, add support for multiple runs karma
  * Change package.json due to new structure
  * Separate tape-dom with karma, remove index.js
  * move index.html & fixtures to browser folder, better structure
  * move index.html & fixtures to browser folder, better structure
  * Make specs more modular, better structure
  * this is my last typo in .travis.yml
  * another typo in .travis.yml
  * typo in .travis.yml
  * Merge branch 'master' of github.com:devlucky/Kakapo.js
  * EHH... Updating firefox on travis...
  * Update README.md
  * Change karma launcher to firefox, since travis doesnt have chrome
  * Fix travis' yaml file
  * Support for Travis-CI with karma test-runner
  * Merge branch 'master' of github.com:devlucky/Kakapo.js
  * Change tests for travis
  * Add comments for tape-dom
  * Add some docs...
  * Add some docs...
  * Clean up tests for further travis-ci integration
  * Run npm scripts with npm-run-all to kill all scripts on ctrl-c
  * Support Request headers
  * Implement response headers support
  * Merge remote-tracking branch 'origin/master' into feature/rich_response_support
  * Merge pull request #17 from devlucky/feature/return_response_instances_in_fakeFetch
  * Use const for fakeResponse function
  * Response headers wip
  * Introduce Response concept
  * Make tests support Fetch Api
  * Return Response instances for fakeFetch
  * Clean fetch.js, Parse query
  * Some more ES6 goodness, Support for query
  * Support request query handling
  * Return request params in request handler
  * Return request body in handler
  * Intercept XHMLHttpRequest
  * Implement Interceptors concept
  * Improving Router coverage
  * Working on interceptor...
  * Remove wip
  * Change scripts to run concurrently since serve is watching
  * Change python server to npm serve
  * Script to run tests in one tab
  * Add missing dev-dependency
  * Update README.md
  * Improve coverage for DB
  * DB first draft
  * remove ghooks
  * Fix environment
  * 0.1.1

v0.1.1 / 2016-04-06
===================

  * 0.1.1
  * Initial commit