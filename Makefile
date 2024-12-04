lud-stop-dev:
	docker compose -f compose.dev.yml down && docker system prune -a && docker volume prune -a
lud-start-dev:
	docker compose -f compose.dev.yml up