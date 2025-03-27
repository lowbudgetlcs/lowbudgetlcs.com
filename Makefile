# Usage: make COMMAND [SERVICE=client|server]
#
# COMMAND is defined below, SERVCE=client|server is optional to run operations
# on only the client or only the server.
# Basically 'make build SERVICE=client' will only build the client, etc
CLIENT = lblcs-client
SERVER = lblcs-server
SERVICES = client server

# Default to building and running both services
SERVICE ?= all

# Build the Docker images
build:
ifeq ($(SERVICE),all)
	docker build -t $(CLIENT) -f client/Dockerfile client
	docker build -t $(SERVER) -f server/Dockerfile server
else
	docker build -t lblcs-$(SERVICE) -f $(SERVICE)/Dockerfile $(SERVICE)
endif

# Start services using Docker Compose
run:
ifeq ($(SERVICE),all)
	docker-compose up -d
else ifeq ($(SERVICE),client)
	docker-compose up -d client
else
	docker-compose up -d server 
endif

# Stop and remove containers
stop:
	docker-compose down 

# Remove images
clean:
	docker rmi -f $(CLIENT) $(SERVER) || true

erase: stop clean

# Full rebuild
all: stop clean build run

.PHONY: all build run stop clean erase

