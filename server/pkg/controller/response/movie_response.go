package response

import (
	"github.com/erkindilekci/cinebase/server/pkg/domain"
	"time"
)

type MovieResponse struct {
	Id             int64           `json:"id"`
	Title          string          `json:"title"`
	ReleaseDate    time.Time       `json:"release_date"`
	Runtime        int64           `json:"runtime"`
	MPAARating     string          `json:"mpaa_rating"`
	Description    string          `json:"description"`
	Image          string          `json:"image"`
	Genres         []*domain.Genre `json:"genres,omitempty"`
	GenresIntArray []int64         `json:"genres_int_array,omitempty"`
}

func ToMovieResponse(movie *domain.Movie) *MovieResponse {
	return &MovieResponse{
		Id:             movie.Id,
		Title:          movie.Title,
		ReleaseDate:    movie.ReleaseDate,
		Runtime:        movie.Runtime,
		MPAARating:     movie.MPAARating,
		Description:    movie.Description,
		Image:          movie.Image,
		Genres:         movie.Genres,
		GenresIntArray: movie.GenresIntArray,
	}
}

func ToMovieResponseList(movies []*domain.Movie) []*MovieResponse {
	var responses []*MovieResponse
	for _, movie := range movies {
		responses = append(responses, ToMovieResponse(movie))
	}
	return responses
}

type GenreResponse struct {
	Id    int64  `json:"id"`
	Genre string `json:"genre"`
}

func ToGenreResponse(genre *domain.Genre) *GenreResponse {
	return &GenreResponse{Id: genre.Id, Genre: genre.Genre}
}

func ToGenreResponseList(genres []*domain.Genre) []*GenreResponse {
	var responses []*GenreResponse
	for _, genre := range genres {
		responses = append(responses, ToGenreResponse(genre))
	}
	return responses
}
