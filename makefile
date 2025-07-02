.PHONY: dev

dev:
	@echo "Starting development environment..."
	docker-compose up -d --build && pnpm run start:dev
	@echo "Development environment started."
