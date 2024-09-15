package repository

import (
	"github.com/erkindilekci/cinebase/server/pkg/domain"
	"github.com/jackc/pgx/v4"
)

func extractMoviesFromRows(movieRows pgx.Rows) ([]*domain.Movie, error) {
	var movies []*domain.Movie

	for movieRows.Next() {
		movie := domain.Movie{}
		err := movieRows.Scan(
			&movie.Id,
			&movie.Title,
			&movie.ReleaseDate,
			&movie.Runtime,
			&movie.MPAARating,
			&movie.Description,
			&movie.Image,
			&movie.CreatedAt,
			&movie.UpdateAt,
		)
		if err != nil {
			return nil, err
		}

		movies = append(movies, &movie)
	}

	return movies, nil
}

func extractGenresFromRows(genreRows pgx.Rows) ([]*domain.Genre, error) {
	var genres []*domain.Genre

	for genreRows.Next() {
		genre := domain.Genre{}
		err := genreRows.Scan(&genre.Id, &genre.Genre)
		if err != nil {
			return nil, err
		}

		genres = append(genres, &genre)
	}

	return genres, nil
}
