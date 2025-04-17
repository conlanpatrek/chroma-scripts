DIST = ./dist
SRC = ./src
TS_FILES = $(shell find $(SRC)/**/*.ts)
ESBUILD = ./node_modules/.bin/esbuild
ESBUILD_OPTS = --sourcemap=inline --bundle --loader:.html=text --minify

.PHONY: clean all

clean:
	rm -rf $(DIST)

all: dist/lazydarkmode.js dist/lazydarkmode.css dist/theatermode.css dist/nochat.js

dist/lazydarkmode.js: $(ESBUILD) $(TS_FILES)
	$(ESBUILD) $(ESBUILD_OPTS) $(SRC)/LazyDarkMode/index.ts --outfile=$(DIST)/lazydarkmode.js

dist/nochat.js: $(ESBUILD) $(TS_FILES)
	$(ESBUILD) $(ESBUILD_OPTS) $(SRC)/NoChat/index.ts --outfile=$(DIST)/nochat.js

dist/lazydarkmode.css: $(ESBUILD) $(SRC)/LazyDarkMode/index.css
	$(ESBUILD) $(ESBUILD_OPTS) $(SRC)/LazyDarkMode/index.css --outfile=$(DIST)/lazydarkmode.css

dist/theatermode.css: $(ESBUILD) $(SRC)/BetterTheaterMode/index.css
	$(ESBUILD) $(ESBUILD_OPTS) $(SRC)/BetterTheaterMode/index.css --outfile=$(DIST)/theatermode.css

$(ESBUILD):
	npm install
