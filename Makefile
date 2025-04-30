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

.PHONY: clean all build

clean:
	rm -rf $(DIST)

all: dist/lazydarkmode.js dist/lazydarkmode.css dist/theatermode.css dist/nochat.js

build: clean all

dist/lazydarkmode.js: $(ESBUILD_BIN) $(TS_FILES)
	$(ESBUILD) $(SRC)/lazydarkmode.entry.ts --outfile=$(DIST)/lazydarkmode.js

dist/lazydarkmode.css: $(ESBUILD_BIN) $(SRC)/lazydarkmode.entry.css
	$(ESBUILD) $(SRC)/lazydarkmode.entry.css --outfile=$(DIST)/lazydarkmode.css

dist/nochat.js: $(ESBUILD_BIN) $(TS_FILES)
	$(ESBUILD) $(SRC)/disablechat.entry.ts --outfile=$(DIST)/nochat.js

dist/theatermode.css: $(ESBUILD_BIN) $(SRC)/theatermode.entry.css
	$(ESBUILD) $(SRC)/theatermode.entry.css --outfile=$(DIST)/theatermode.css

$(ESBUILD_BIN):
	npm install
