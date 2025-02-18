package config

import (
	"database/sql"
	"fmt"
	"log"
	"strings"

	_ "github.com/lib/pq"
	"github.com/spf13/viper"
)

type Config struct {
	AppPort          string
	DatabaseHost     string
	DatabasePort     int
	DatabaseUser     string
	DatabasePassword string
	DatabaseName     string
	DatabaseSSLMode  string
}

var DB *sql.DB

func LoadConfig() (*Config, error) {
	viper.SetConfigFile(".env")
	viper.SetConfigType("env")
	viper.AddConfigPath(".")

	viper.AutomaticEnv()
	viper.SetEnvKeyReplacer(strings.NewReplacer(".", "_"))

	err := viper.ReadInConfig()
	if err != nil {
		log.Printf(" No .env file found: %s", err)
	} else {
		fmt.Println(".env file loaded successfully!")
	}

	viper.SetDefault("APP.PORT", "8080")
	viper.SetDefault("DATABASE.HOST", "db")
	viper.SetDefault("DATABASE.PORT", 5432)
	viper.SetDefault("DATABASE.USER", "helpdesk_user")
	viper.SetDefault("DATABASE.PASSWORD", "123456")
	viper.SetDefault("DATABASE.NAME", "helpdesk")
	viper.SetDefault("DATABASE.SSLMODE", "disable")

	config := &Config{
		AppPort:          viper.GetString("APP.PORT"),
		DatabaseHost:     viper.GetString("DATABASE.HOST"),
		DatabasePort:     viper.GetInt("DATABASE.PORT"),
		DatabaseUser:     viper.GetString("DATABASE.USER"),
		DatabasePassword: viper.GetString("DATABASE.PASSWORD"),
		DatabaseName:     viper.GetString("DATABASE.NAME"),
		DatabaseSSLMode:  viper.GetString("DATABASE.SSLMODE"),
	}

	return config, nil
}

func (c *Config) GetConnectionString() string {
	return fmt.Sprintf("host=%s port=%d user=%s password=%s dbname=%s sslmode=%s",
		c.DatabaseHost,
		c.DatabasePort,
		c.DatabaseUser,
		c.DatabasePassword,
		c.DatabaseName,
		c.DatabaseSSLMode)
}

func ConnectDatabase(cfg *Config) {
	dsn := cfg.GetConnectionString()

	db, err := sql.Open("postgres", dsn)
	if err != nil {
		log.Fatal("Failed to connect to database:", err)
	}

	err = db.Ping()
	if err != nil {
		log.Fatal("Database is not responding:", err)
	}

	fmt.Println("Database connected successfully!")
	DB = db
}
