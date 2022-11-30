build:
	npm run build

dev:
	cd dev-app && npm run dev

lint:
	npm run lint

size-limit: build
	npm run size-limit

typecheck:
	npm run typecheck

test:
	npm run test:watch

check:
	npm run typecheck
	npm run test
	npm run lint
	make size-limit

bump:
	npm version patch
	git add .
	git push

publish: check bump
	npm publish

up:
	pnpm up