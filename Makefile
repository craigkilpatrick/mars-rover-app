# This conditional statement checks if there is a file named .env in the current directory.
ifneq (,$(wildcard ./.env))
	include .env
	export
endif

export SHA_TAG = $(shell git rev-parse --short HEAD)

BASE_IMAGE = node:18-alpine

# Split Docker run command for flexibility
DOCKER_RUN_CMD = docker run --env-file .env --rm -v "$(PWD)":/app -w /app
DOCKER_RUN_NPM = npm

.PHONY: help clean install build test lint format dev up down up-dev up-prod docker-build

help: ## Show this help
	@echo "Available targets:"
	@grep -h "##" $(MAKEFILE_LIST) | grep -v "grep" | sed -e 's/\(.*\):.*##\(.*\)/\1:\2/g' | column -t -s ":"

clean: ## Clean up build artifacts and dependencies
	rm -rf node_modules dist coverage

install: ## Install dependencies
	@echo "Running dependency checks..."
	@echo "Checking for existing .env file..."
	@if [ -f .env ]; then \
		echo "Environment file found! ✅  "; \
		echo "Checking for missing keys based on keys defined in '.env.template'..."; \
		template_keys=$$(grep -v '^#' .env.template | cut -d '=' -f1); \
		env_keys=$$(grep -v '^#' .env | cut -d '=' -f1); \
		missing_keys=false; \
		for key in $$template_keys; do \
			if ! echo "$$env_keys" | grep -q "^$$key$$"; then \
				echo "\033[31mMissing key in .env: $$key\033[0m ❌"; \
				missing_keys=true; \
			fi \
		done; \
		if [ "$$missing_keys" = false ]; then \
			echo "Environment file has all required keys! ✅  "; \
		else \
			echo "\033[31mPlease add the missing keys to your .env file\033[0m"; \
			exit 1; \
		fi \
	else \
		echo "\033[31mNo .env file found!\033[0m ❌"; \
		echo "Creating .env from template..."; \
		cp .env.template .env; \
		echo "Created .env file! Please update the values ✅"; \
	fi
	@echo "\033[32mEnvironment file is good to go!\033[0m 🎉 "
	@echo "\033[32mAll dependencies are good to go!\033[0m 🎉 "

build: ## Build the application
	docker run --env-file .env --rm -v "$(PWD)":/app -w /app node:18-alpine npm run build

test: ## Run tests
	docker run --env-file .env --rm -v "$(PWD)":/app -w /app node:18-alpine npm run test:run

lint: ## Run linting
	docker run --env-file .env --rm -v "$(PWD)":/app -w /app node:18-alpine npm run lint

format: ## Format code
	docker run --env-file .env --rm -v "$(PWD)":/app -w /app node:18-alpine npm run format

dev: ## Run development server locally
	npm run dev

up-dev: ## Start development containers
	docker compose --profile dev up -d mars-rover-app-dev

up-prod: ## Start production containers
	docker compose --profile prod up -d mars-rover-app-prod

up: up-dev ## Default to development mode (alias for up-dev)

down: ## Stop all containers
	docker compose down

docker-build: ## Build Docker image
	make build
	docker build -t mars-rover-app:$$(git rev-parse --short HEAD) .

# Define color escape codes
COLOR_RESET = \033[0m
COLOR_CYAN = \033[36m
COLOR_GREEN = \033[32m
COLOR_RED = \033[31m
COLOR_YELLOW = \033[33m

# Define Unicode characters for emojis
CHECKMARK = \xE2\x9C\x85  # Checkmark emoji
TADA = \xF0\x9F\x8E\x89 # Tada emoji
RED_X = \xE2\x9D\x8C # Red X emoji
