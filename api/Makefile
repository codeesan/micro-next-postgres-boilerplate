NAME := ma-api
PORT := 3001
VERSION := $(shell git rev-parse --short HEAD)
DOCKER_NS := tuckerconnelly
DOCKER_ENV := $(shell cat .env | grep -v '^\#' | xargs -I % echo '-e %')

# docker- commands for testing before deployment

docker-build:
	docker build . -t $(DOCKER_NS)/$(NAME):$(VERSION)
.PHONY: docker-build

docker-run:
	docker run -p $(PORT):$(PORT) -it $(DOCKER_ENV) $(DOCKER_NS)/$(NAME):$(VERSION)
.PHONY: docker-run

docker-shell:
	docker run -it $(DOCKER_ENV) $(DOCKER_NS)/$(NAME):$(VERSION) /bin/sh
.PHONY: docker-shell
