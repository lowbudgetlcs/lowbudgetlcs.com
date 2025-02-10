# Usage: make COMMAND [SERVICE=client|server]
#
# COMMAND is defined below, SERVCE=client|server is optional to run operations
# on only the client or only the server.
# Define services
CLIENT = lowbudget-client
SERVER = lowbudget-server
SERVICES = client server

# Default to building and running both services
SERVICE ?= all

# Build the Docker images
build:
ifeq ($(SERVICE),all)
	docker build -t $(CLIENT) -f client/Dockerfile client
	docker build -t $(SERVER) -f server/Dockerfile server
else
	docker build -t lowbudget-$(SERVICE) -f Dockerfile.$(SERVICE) .
endif

# Start services using Docker Compose
run:
	docker-compose up -d $(if $(filter $(SERVICE),all),,lowbudget-$(SERVICE)-container)

# Stop and remove containers
stop:
	docker-compose down $(if $(filter $(SERVICE),all),,lowbudget-$(SERVICE)-container)

# Remove images
clean:
	docker rmi -f $(CLIENT) $(SERVER) || true

erase: stop clean

# Full rebuild
all: stop clean build run

# Show logs
logs:
	docker-compose logs -f $(if $(filter $(SERVICE),all),,lowbudget-$(SERVICE))

.PHONY: all build run stop clean logs erase

