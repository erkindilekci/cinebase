package service

import (
	"encoding/json"
	"fmt"
	"github.com/erkindilekci/cinebase/server/pkg/controller/request"
	"github.com/erkindilekci/cinebase/server/pkg/domain"
	"github.com/erkindilekci/cinebase/server/pkg/repository"
	"log"
	"net/http"
	"net/url"
	"os"
	"time"
)

type IMovieService interface {
	GetAllMovies() ([]*domain.Movie, error)
	GetMoviesByGenreId(genreId int64) ([]*domain.Movie, error)
	GetMovieById(id int64) (*domain.Movie, error)
	GetMovieByIdEdit(id int64) (*domain.Movie, error)
	GetAllGenres() ([]*domain.Genre, error)
	AddMovie(movieReq request.AddMovieRequest) (*domain.Movie, error)
	UpdateMovie(id int64, movieReq request.AddMovieRequest) (*domain.Movie, error)
	DeleteMovie(id int64) error
}

type MovieService struct {
	movieRepository repository.IMovieRepository
}

func NewMovieService(movieRepository repository.IMovieRepository) IMovieService {
	return &MovieService{movieRepository}
}

func (service *MovieService) GetAllMovies() ([]*domain.Movie, error) {
	return service.movieRepository.GetAllMovies()
}

func (service *MovieService) GetMoviesByGenreId(genreId int64) ([]*domain.Movie, error) {
	return service.movieRepository.GetMoviesByGenreId(genreId)
}

func (service *MovieService) GetMovieById(id int64) (*domain.Movie, error) {
	return service.movieRepository.GetMovieById(id)
}

func (service *MovieService) GetMovieByIdEdit(id int64) (*domain.Movie, error) {
	return service.movieRepository.GetMovieByIdEdit(id)
}

func (service *MovieService) GetAllGenres() ([]*domain.Genre, error) {
	return service.movieRepository.GetAllGenres()
}

func (service *MovieService) AddMovie(movieReq request.AddMovieRequest) (*domain.Movie, error) {
	releaseDate, err := time.Parse("2006-01-02", movieReq.ReleaseDate)
	if err != nil {
		return nil, err
	}

	movie := &domain.Movie{
		Title:       movieReq.Title,
		ReleaseDate: releaseDate,
		Runtime:     movieReq.Runtime,
		MPAARating:  movieReq.MPAARating,
		Description: movieReq.Description,
		Image:       movieReq.Image,
	}

	if movie.Image == "" {
		movie.Image = getMoviePosterWithMovieTitle(movie.Title)
	}

	genres := make([]int64, len(movieReq.Genres))
	for i, g := range movieReq.Genres {
		genres[i] = int64(g)
	}
	movie.GenresIntArray = genres

	return service.movieRepository.AddMovie(movie)
}

func (service *MovieService) UpdateMovie(id int64, movieReq request.AddMovieRequest) (*domain.Movie, error) {
	releaseDate, err := time.Parse("2006-01-02", movieReq.ReleaseDate)
	if err != nil {
		return nil, err
	}

	movie := &domain.Movie{
		Id:          id,
		Title:       movieReq.Title,
		ReleaseDate: releaseDate,
		Runtime:     movieReq.Runtime,
		MPAARating:  movieReq.MPAARating,
		Description: movieReq.Description,
		Image:       movieReq.Image,
	}

	genres := make([]int64, len(movieReq.Genres))
	for i, g := range movieReq.Genres {
		genres[i] = int64(g)
	}
	movie.GenresIntArray = genres

	return service.movieRepository.UpdateMovie(movie)
}

func getMoviePosterWithMovieTitle(title string) string {
	client := &http.Client{}
	baseURL := "https://api.themoviedb.org/3/search/movie"
	apiKey := os.Getenv("API_KEY")

	myUrl := fmt.Sprintf("%s?api_key=%s&query=%s", baseURL, apiKey, url.QueryEscape(title))

	req, err := http.NewRequest("GET", myUrl, nil)
	if err != nil {
		log.Println("Request creation error:", err)
		return ""
	}

	req.Header.Set("Accept", "application/json")
	req.Header.Set("Content-Type", "application/json")

	resp, err := client.Do(req)
	if err != nil {
		log.Println("Request error:", err)
		return ""
	}
	defer resp.Body.Close()

	var result struct {
		Results []struct {
			PosterPath string `json:"poster_path"`
		} `json:"results"`
	}

	if err := json.NewDecoder(resp.Body).Decode(&result); err != nil {
		log.Println("Response decode error:", err)
		return ""
	}

	if len(result.Results) > 0 {
		return "https://image.tmdb.org/t/p/w500/" + result.Results[0].PosterPath[1:]
	}

	return ""
}

func (service *MovieService) DeleteMovie(id int64) error {
	return service.movieRepository.DeleteMovieById(id)
}
