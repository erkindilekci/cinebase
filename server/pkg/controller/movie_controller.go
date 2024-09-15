package controller

import (
	"fmt"
	"github.com/erkindilekci/cinebase/server/pkg/controller/request"
	"github.com/erkindilekci/cinebase/server/pkg/controller/response"
	"github.com/erkindilekci/cinebase/server/pkg/domain"
	"github.com/erkindilekci/cinebase/server/pkg/graph"
	"github.com/erkindilekci/cinebase/server/pkg/middleware"
	"github.com/erkindilekci/cinebase/server/pkg/service"
	"github.com/labstack/echo/v4"
	"net/http"
	"strconv"
)

type MovieController struct {
	movieService service.IMovieService
}

func NewMovieController(movieService service.IMovieService) *MovieController {
	return &MovieController{movieService}
}

func (controller *MovieController) RegisterMovieRoutes(e *echo.Echo) {
	e.GET("/movies", controller.GetAllMovies)
	e.GET("/movies/:id", controller.GetMovieById)
	e.GET("/genres", controller.GetAllGenres)
	e.POST("graphql", controller.HandleGraphql)

	adminGroup := e.Group("/admin")
	adminGroup.Use(middleware.CheckAuthorizationHeader)
	adminGroup.GET("/movies", controller.MovieCatalogue)
	adminGroup.GET("/movies/:id", controller.GetMovieByIdEdit)
	adminGroup.POST("/movies", controller.AddMovie)
	adminGroup.PUT("/movies/:id", controller.UpdateMovieById)
	adminGroup.DELETE("/movies/:id", controller.DeleteMovieById)
}

func (controller *MovieController) GetAllMovies(c echo.Context) error {
	genre := c.QueryParam("genre")
	var movies []*domain.Movie
	var err error

	if len(genre) > 0 {
		var genreId int
		genreId, err = strconv.Atoi(genre)
		movies, err = controller.movieService.GetMoviesByGenreId(int64(genreId))
	} else {
		movies, err = controller.movieService.GetAllMovies()
	}

	if err != nil {
		return c.JSON(http.StatusInternalServerError, response.NewErrorResponse(err.Error()))
	}

	return c.JSON(http.StatusOK, response.ToMovieResponseList(movies))
}

func (controller *MovieController) GetAllGenres(c echo.Context) error {
	genres, err := controller.movieService.GetAllGenres()
	if err != nil {
		return c.JSON(http.StatusInternalServerError, response.NewErrorResponse(err.Error()))
	}

	return c.JSON(http.StatusOK, response.ToGenreResponseList(genres))
}

func (controller *MovieController) MovieCatalogue(c echo.Context) error {
	movies, err := controller.movieService.GetAllMovies()
	if err != nil {
		return c.JSON(http.StatusInternalServerError, response.NewErrorResponse(err.Error()))
	}

	return c.JSON(http.StatusOK, response.ToMovieResponseList(movies))
}

func (controller *MovieController) GetMovieById(c echo.Context) error {
	param := c.Param("id")
	if param == "" {
		return c.JSON(http.StatusBadRequest, response.NewErrorResponse("Invalid request: no movie id specified"))
	}

	movieId, err := strconv.Atoi(param)
	if err != nil {
		return c.JSON(http.StatusBadRequest, response.NewErrorResponse("Invalid request: movie id must be an integer"))
	}

	movie, err := controller.movieService.GetMovieById(int64(movieId))
	if err != nil {
		return c.JSON(http.StatusNotFound, response.NewErrorResponse(fmt.Sprintf("Movie not found: no movie with ID %d", movieId)))
	}

	return c.JSON(http.StatusOK, response.ToMovieResponse(movie))
}

func (controller *MovieController) GetMovieByIdEdit(c echo.Context) error {
	param := c.Param("id")
	if param == "" {
		return c.JSON(http.StatusBadRequest, response.NewErrorResponse("Invalid request: no movie id specified"))
	}

	movieId, err := strconv.Atoi(param)
	if err != nil {
		return c.JSON(http.StatusBadRequest, response.NewErrorResponse("Invalid request: movie id must be an integer"))
	}

	movieEdit, err := controller.movieService.GetMovieByIdEdit(int64(movieId))
	if err != nil {
		return c.JSON(http.StatusNotFound, response.NewErrorResponse(fmt.Sprintf("Movie not found: no movie with ID %d", movieId)))
	}

	return c.JSON(http.StatusOK, response.ToMovieResponse(movieEdit))
}

func (controller *MovieController) AddMovie(c echo.Context) error {
	var movieReq request.AddMovieRequest
	if err := c.Bind(&movieReq); err != nil {
		return c.JSON(http.StatusBadRequest, response.NewErrorResponse("Invalid request body"))
	}

	newMovie, err := controller.movieService.AddMovie(movieReq)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, response.NewErrorResponse(err.Error()))
	}

	return c.JSON(http.StatusCreated, response.ToMovieResponse(newMovie))
}

func (controller *MovieController) UpdateMovieById(c echo.Context) error {
	id, err := strconv.ParseInt(c.Param("id"), 10, 64)
	if err != nil {
		return c.JSON(http.StatusBadRequest, response.NewErrorResponse("Invalid movie ID"))
	}

	var movieReq request.AddMovieRequest
	if err := c.Bind(&movieReq); err != nil {
		return c.JSON(http.StatusBadRequest, response.NewErrorResponse("Invalid request body"))
	}

	updatedMovie, err := controller.movieService.UpdateMovie(id, movieReq)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, response.NewErrorResponse(err.Error()))
	}

	return c.JSON(http.StatusOK, response.ToMovieResponse(updatedMovie))
}

func (controller *MovieController) DeleteMovieById(c echo.Context) error {
	id, err := strconv.ParseInt(c.Param("id"), 10, 64)
	if err != nil {
		return c.JSON(http.StatusBadRequest, response.NewErrorResponse("Invalid movie ID"))
	}

	err = controller.movieService.DeleteMovie(id)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, response.NewErrorResponse(err.Error()))
	}

	return c.NoContent(http.StatusOK)
}

func (controller *MovieController) HandleGraphql(c echo.Context) error {
	movies, err := controller.movieService.GetAllMovies()
	if err != nil {
		return c.JSON(http.StatusInternalServerError, response.NewErrorResponse(err.Error()))
	}

	var params struct {
		Query string `json:"query"`
	}

	err = c.Bind(&params)
	if err != nil {
		return c.JSON(http.StatusBadRequest, response.NewErrorResponse("Invalid request body"))
	}

	g := graph.New(response.ToMovieResponseList(movies))
	g.QueryString = params.Query

	resp, err := g.Query()
	if err != nil {
		return c.JSON(http.StatusInternalServerError, response.NewErrorResponse("Error executing query"))
	}

	return c.JSON(http.StatusOK, resp)
}
