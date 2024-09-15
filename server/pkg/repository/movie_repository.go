package repository

import (
	"context"
	"database/sql"
	"errors"
	"github.com/erkindilekci/cinebase/server/pkg/domain"
	"github.com/jackc/pgx/v4/pgxpool"
	"github.com/labstack/gommon/log"
	"time"
)

type IMovieRepository interface {
	GetAllMovies() ([]*domain.Movie, error)
	GetMoviesByGenreId(genreId int64) ([]*domain.Movie, error)
	GetMovieById(id int64) (*domain.Movie, error)
	GetMovieByIdEdit(id int64) (*domain.Movie, error)
	GetAllGenres() ([]*domain.Genre, error)
	AddMovie(movie *domain.Movie) (*domain.Movie, error)
	UpdateMovie(movie *domain.Movie) (*domain.Movie, error)
	DeleteMovieById(id int64) error
}

type MovieRepository struct {
	dbPool *pgxpool.Pool
}

func NewMovieRepository(dbPool *pgxpool.Pool) IMovieRepository {
	return &MovieRepository{dbPool}
}

const dbTimeout = time.Second * 3

func (repository *MovieRepository) GetAllMovies() ([]*domain.Movie, error) {
	ctx, cancel := context.WithTimeout(context.Background(), dbTimeout)
	defer cancel()

	selectQuery := `SELECT id, title, release_date, runtime, mpaa_rating, description, COALESCE(image, ''), created_at, updated_at
		FROM movies ORDER BY title`

	movieRows, err := repository.dbPool.Query(ctx, selectQuery)
	if err != nil {
		log.Errorf("error while getting all movies: %v", err)
		return nil, err
	}
	defer movieRows.Close()

	return extractMoviesFromRows(movieRows)
}

func (repository *MovieRepository) GetMoviesByGenreId(genreId int64) ([]*domain.Movie, error) {
	ctx, cancel := context.WithTimeout(context.Background(), dbTimeout)
	defer cancel()

	selectQuery := `
        SELECT m.id, m.title, m.release_date, m.runtime, m.mpaa_rating, m.description, COALESCE(m.image, ''), m.created_at, m.updated_at
        FROM movies m
        JOIN movies_genres mg ON m.id = mg.movie_id
        WHERE mg.genre_id = $1
        ORDER BY m.title`

	movieRows, err := repository.dbPool.Query(ctx, selectQuery, genreId)
	if err != nil {
		log.Errorf("error while getting movies by genre: %v", err)
		return nil, err
	}
	defer movieRows.Close()

	return extractMoviesFromRows(movieRows)
}

func (repository *MovieRepository) GetMovieById(id int64) (*domain.Movie, error) {
	ctx, cancel := context.WithTimeout(context.Background(), dbTimeout)
	defer cancel()

	selectMovieQuery := `SELECT id, title, release_date, runtime, mpaa_rating, description, COALESCE(image, ''), created_at, updated_at
		FROM movies WHERE id = $1`

	movieRow := repository.dbPool.QueryRow(ctx, selectMovieQuery, id)

	var movie domain.Movie
	err := movieRow.Scan(
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
		log.Errorf("error while getting movie by id: %d", id)
		return nil, err
	}

	selectGenreQuery := `
		SELECT genre.id, genre.genre
		FROM movies_genres movie_genre
		LEFT JOIN genres genre
		ON movie_genre.genre_id = genre.id
		WHERE movie_genre.movie_id = $1
		ORDER BY genre.genre`

	genreRows, err := repository.dbPool.Query(ctx, selectGenreQuery, id) // Pass the movie_id here
	if err != nil && !errors.Is(err, sql.ErrNoRows) {
		log.Errorf("error while getting movie's genres: %v", err)
		return nil, err
	}
	defer genreRows.Close()

	genres, err := extractGenresFromRows(genreRows)
	movie.Genres = genres

	return &movie, nil
}

func (repository *MovieRepository) GetMovieByIdEdit(id int64) (*domain.Movie, error) {
	ctx, cancel := context.WithTimeout(context.Background(), dbTimeout)
	defer cancel()

	selectMovieQuery := `SELECT id, title, release_date, runtime, mpaa_rating, description, COALESCE(image, ''), created_at, updated_at
		FROM movies WHERE id = $1`

	movieRow := repository.dbPool.QueryRow(ctx, selectMovieQuery, id)

	var movie domain.Movie
	err := movieRow.Scan(
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
		log.Errorf("error while getting movie by id: %d", id)
		return nil, err
	}

	selectGenreQuery := `
		SELECT genre.id, genre.genre
		FROM movies_genres movie_genre
		LEFT JOIN genres genre
		ON movie_genre.genre_id = genre.id
		WHERE movie_genre.movie_id = $1
		ORDER BY genre.genre`

	genreRows, err := repository.dbPool.Query(ctx, selectGenreQuery, id)
	if err != nil && !errors.Is(err, sql.ErrNoRows) {
		log.Errorf("error while getting movie's genres: %v", err)
		return nil, err
	}
	defer genreRows.Close()

	genres, err := extractGenresFromRows(genreRows)

	var genresIntArray []int64
	for _, g := range genres {
		genresIntArray = append(genresIntArray, g.Id)
	}

	movie.Genres = genres
	movie.GenresIntArray = genresIntArray

	return &movie, nil
}

func (repository *MovieRepository) GetAllGenres() ([]*domain.Genre, error) {
	ctx, cancel := context.WithTimeout(context.Background(), dbTimeout)
	defer cancel()

	selectQuery := `SELECT id, genre FROM genres ORDER BY id`

	genreRows, err := repository.dbPool.Query(ctx, selectQuery)
	if err != nil {
		log.Errorf("error while getting all genres: %v", err)
		return nil, err
	}
	defer genreRows.Close()

	return extractGenresFromRows(genreRows)
}

func (repository *MovieRepository) AddMovie(movie *domain.Movie) (*domain.Movie, error) {
	ctx, cancel := context.WithTimeout(context.Background(), dbTimeout)
	defer cancel()

	tx, err := repository.dbPool.Begin(ctx)
	if err != nil {
		return nil, err
	}
	defer tx.Rollback(ctx)

	query := `INSERT INTO movies (title, release_date, runtime, mpaa_rating, description, image, created_at, updated_at)
		VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW()) RETURNING id`

	err = tx.QueryRow(ctx, query,
		movie.Title, movie.ReleaseDate, movie.Runtime, movie.MPAARating, movie.Description, movie.Image,
	).Scan(&movie.Id)

	if err != nil {
		return nil, err
	}

	for _, genreID := range movie.GenresIntArray {
		_, err = tx.Exec(ctx, "INSERT INTO movies_genres (movie_id, genre_id) VALUES ($1, $2)", movie.Id, genreID)
		if err != nil {
			return nil, err
		}
	}

	err = tx.Commit(ctx)
	if err != nil {
		return nil, err
	}

	return movie, nil
}

func (repository *MovieRepository) UpdateMovie(movie *domain.Movie) (*domain.Movie, error) {
	ctx, cancel := context.WithTimeout(context.Background(), dbTimeout)
	defer cancel()

	tx, err := repository.dbPool.Begin(ctx)
	if err != nil {
		return nil, err
	}
	defer tx.Rollback(ctx)

	query := `UPDATE movies SET title = $1, release_date = $2, runtime = $3, mpaa_rating = $4, description = $5, image = $6, updated_at = NOW()
        WHERE id = $7 RETURNING id, updated_at`

	err = tx.QueryRow(ctx, query,
		movie.Title, movie.ReleaseDate, movie.Runtime, movie.MPAARating, movie.Description, movie.Image, movie.Id,
	).Scan(&movie.Id, &movie.UpdateAt)

	if err != nil {
		return nil, err
	}

	_, err = tx.Exec(ctx, "DELETE FROM movies_genres WHERE movie_id = $1", movie.Id)
	if err != nil {
		return nil, err
	}

	for _, genreID := range movie.GenresIntArray {
		_, err = tx.Exec(ctx, "INSERT INTO movies_genres (movie_id, genre_id) VALUES ($1, $2)", movie.Id, genreID)
		if err != nil {
			return nil, err
		}
	}

	err = tx.Commit(ctx)
	if err != nil {
		return nil, err
	}

	return movie, nil
}

func (repository *MovieRepository) DeleteMovieById(id int64) error {
	ctx, cancel := context.WithTimeout(context.Background(), dbTimeout)
	defer cancel()

	tx, err := repository.dbPool.Begin(ctx)
	if err != nil {
		return err
	}
	defer tx.Rollback(ctx)

	_, err = tx.Exec(ctx, "DELETE FROM movies_genres WHERE movie_id = $1", id)
	if err != nil {
		return err
	}

	_, err = tx.Exec(ctx, "DELETE FROM movies WHERE id = $1", id)
	if err != nil {
		return err
	}

	err = tx.Commit(ctx)
	if err != nil {
		return err
	}

	return nil
}
