build:
	npm run build

lint:
	npm run lint

size-limit: build
	npm run size-limit

typecheck:
	npm run typecheck

test:
	npm run test
	npm run build
	npm run size-limit

yaspeller:
	npm run yaspeller

check: test lint typecheck

bump:
	npm version patch
	git add .
	git push

publish: check bump
	npm publish