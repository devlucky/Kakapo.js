SERVE="node_modules/serve/bin/serve"
KARMA="node_modules/karma/bin/karma"
WATCHIFY="node_modules/watchify/bin/cmd.js"
CODECOV="node_modules/codecov.io/bin/codecov.io.js"
SEMANTIC_RELEASE="node_modules/semantic-release/bin/semantic-release.js"

KARMA_CONF=".karma.conf.js"
KARMA_CONF_TRAVIS=".karma.travis.conf.js"

build:
	webpack

codecov:
	cat test/coverage/*/lcov.info | $(CODECOV)

test: test-browser

test-browser:
	make --jobs 4 \
		_test-browser--serve \
		_test-browser--watchify \
		_test-browser--open

test-karma:
	$(KARMA) start $(KARMA_CONF) --single-run

test-karma-watch:
	$(KARMA) start $(KARMA_CONF)

test-travis:
	$(KARMA) start $(KARMA_CONF_TRAVIS) --single-run

semantic-release:
	$(SEMANTIC_RELEASE) pre && npm publish && $(SEMANTIC_RELEASE) post

#=== Targets to be used only internally. ===#
_test-browser--serve:
	$(SERVE) test/browser

_test-browser--watchify:
	$(WATCHIFY) test/runners/browser.js -o test/browser/test_bundle.js

_test-browser--open:
	open http://localhost:3000
