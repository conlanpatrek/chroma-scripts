DIST = ./dist
SRC = ./src
TS_FILES = $(shell find $(SRC)/**/*.ts)
ESBUILD_BIN = ./node_modules/.bin/esbuild
env ?= production

ifeq ($(env), dev)
OPTS = --sourcemap=inline
else
OPTS = --minify
endif

ESBUILD = $(ESBUILD_BIN) --bundle --loader:.html=text $(OPTS)

.PHONY: clean all

clean:
	rm -rf $(DIST)

all: dist/lazydarkmode.js dist/lazydarkmode.css dist/theatermode.css dist/nochat.js

dist/lazydarkmode.js: $(ESBUILD_BIN) $(TS_FILES)
	$(ESBUILD) $(SRC)/LazyDarkMode/index.ts --outfile=$(DIST)/lazydarkmode.js

dist/nochat.js: $(ESBUILD_BIN) $(TS_FILES)
	$(ESBUILD) $(SRC)/NoChat/index.ts --outfile=$(DIST)/nochat.js

dist/lazydarkmode.css: $(ESBUILD_BIN) $(SRC)/LazyDarkMode/index.css
	$(ESBUILD) $(SRC)/LazyDarkMode/index.css --outfile=$(DIST)/lazydarkmode.css

dist/theatermode.css: $(ESBUILD_BIN) $(SRC)/BetterTheaterMode/index.css
	$(ESBUILD) $(SRC)/BetterTheaterMode/index.css --outfile=$(DIST)/theatermode.css

$(ESBUILD_BIN):
	npm install
