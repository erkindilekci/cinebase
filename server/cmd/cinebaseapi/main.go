package main

import (
	"context"
	"log"
	"os"

	"github.com/erkindilekci/cinebase/server/pkg/commmon/app"
	"github.com/erkindilekci/cinebase/server/pkg/commmon/postgresql"
	"github.com/erkindilekci/cinebase/server/pkg/controller"
	"github.com/erkindilekci/cinebase/server/pkg/repository"
	"github.com/erkindilekci/cinebase/server/pkg/service"
	"github.com/joho/godotenv"
	"github.com/labstack/echo/v4"
	echoMiddleware "github.com/labstack/echo/v4/middleware"
)

func main() {
	err := godotenv.Load(".env")
	if err != nil {
		log.Fatal(err)
	}

	ctx := context.Background()
	configurationManager := app.NewConfigurationManager()
	dbPool := postgresql.GetConnectionPool(ctx, configurationManager.PostgresqlConfig)
	defer dbPool.Close()

	userRepository := repository.NewUserRepository(dbPool)
	userService := service.NewUserService(userRepository)
	userController := controller.NewUserController(userService)

	movieRepository := repository.NewMovieRepository(dbPool)
	movieService := service.NewMovieService(movieRepository)
	movieController := controller.NewMovieController(movieService)

	e := echo.New()
	e.Use(echoMiddleware.Recover())
	e.Use(echoMiddleware.CORSWithConfig(echoMiddleware.CORSConfig{
		AllowOrigins:     []string{"http://localhost:5173"},
		AllowMethods:     []string{echo.GET, echo.POST, echo.PUT, echo.DELETE, echo.PATCH, echo.OPTIONS},
		AllowHeaders:     []string{"Accept", "Content-Type", "X-CSRF-Token", "Authorization"},
		AllowCredentials: true,
	}))
	userController.RegisterUserRoutes(e)
	movieController.RegisterMovieRoutes(e)

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	log.Println("Server is running on port", port)
	if err := e.Start(":" + port); err != nil {
		log.Fatalf("Failed to start server: %v", err)
	}
}
