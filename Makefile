BROWSERIFY="node_modules/browserify/bin/cmd.js"
SERVE="node_modules/serve/bin/serve"
KARMA="node_modules/karma/bin/karma"
WATCHIFY="node_modules/watchify/bin/cmd.js"
CODECOV="node_modules/codecov.io/bin/codecov.io.js"
SEMANTIC_RELEASE="node_modules/semantic-release/bin/semantic-release.js"

SRC_DIR="src"
LIB_DIR="lib"

KARMA_CONF=".karma.conf.js"
KARMA_CONF_TRAVIS=".karma.travis.conf.js"

build:
	$(BROWSERIFY) $(SRC_DIR) -o $(LIB_DIR)/kakapo.js -s Kakapo -v

codecov:
	cat test/coverage/*/lcov.info | $(CODECOV)

develop:
	mkdir -p $(LIB_DIR) && \
	$(WATCHIFY) $(SRC_DIR) -o $(LIB_DIR)/kakapo.js -s Kakapo -v

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
	$(WATCHIFY) test/runners/browser.js -o test/browser/test_bundle.js -v

_test-browser--open:
	open http://localhost:3000
