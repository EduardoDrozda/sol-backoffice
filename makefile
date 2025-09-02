.PHONY: dev

dev:
	@echo "Starting Api development environment..."
	docker-compose -f apps/sol-backoffice.api/docker-compose.yml up -d --build && pnpm run api:dev
	@echo "Api development environment started."

full:
	@echo "Starting Fullstack development environment..."
	docker-compose -f apps/sol-backoffice.api/docker-compose.yml up -d --build && pnpm run fullstack:dev
	@echo "Fullstack development environment started."
