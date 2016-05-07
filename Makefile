SERVE="node_modules/serve/bin/serve"
KARMA="node_modules/karma/bin/karma"
WATCHIFY="node_modules/watchify/bin/cmd.js"

build:
	webpack

test: test-browser

test-browser:
	make --jobs 4 \
		_test-browser--serve \
		_test-browser--watchify \
		_test-browser--open

test-karma:
	$(KARMA) start .karma.conf.js --single-run

test-karma-watch:
	$(KARMA) start .karma.conf.js

test-travis:
	$(KARMA) start .karma.travis.conf.js --single-run

#=== Targets to be used only internally. ===#
_test-browser--serve:
	$(SERVE) ./test/browser

_test-browser--watchify:
	$(WATCHIFY) test/runners/browser.js -o test/browser/test_bundle.js

_test-browser--open:
	open http://localhost:3000
