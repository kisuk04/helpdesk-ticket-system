# Build Stage
FROM golang:1.23.2 AS builder

WORKDIR /app

# Copy go.mod and go.sum first
COPY go.mod go.sum ./
RUN go mod download

# Install Swaggo
RUN go install github.com/swaggo/swag/cmd/swag@latest

# Copy source code
COPY . .

# Generate Swagger documentation
RUN swag init -g cmd/main.go

# Build Go application
RUN CGO_ENABLED=0 GOOS=linux go build -a -installsuffix cgo -o main ./cmd/main.go

# Final Stage
FROM alpine:latest  

RUN apk --no-cache add ca-certificates tzdata

WORKDIR /root/

COPY --from=builder /app/main .
COPY --from=builder /app/docs ./docs 

EXPOSE 8080

ENTRYPOINT ["./main"]
