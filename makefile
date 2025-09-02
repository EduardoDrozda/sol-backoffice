.PHONY: dev

dev:
	@echo "Starting Api development environment..."
	docker-compose -f apps/sol-backoffice.api/docker-compose.yml up -d --build && pnpm run api:dev
	@echo "Api development environment started."
