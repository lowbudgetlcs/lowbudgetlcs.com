
build:
	docker build -t lblcs-client -f Dockerfile .

# Start services using Docker Compose
run:
	docker-compose up -d $(if $(filter $(SERVICE),all),,lblcs-$(SERVICE))

# Stop and remove containers
stop:
	docker-compose down $(if $(filter $(SERVICE),all),,lblcs-$(SERVICE)-container)

# Remove images
clean:
	docker rmi -f $(CLIENT) $(SERVER) || true

erase: stop clean

# Full rebuild
all: stop clean build run

# Show logs
logs:
	docker-compose logs -f $(if $(filter $(SERVICE),all),,lblcs-$(SERVICE))

.PHONY: all build run stop clean logs erase

