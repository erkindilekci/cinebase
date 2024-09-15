package domain

import (
	"database/sql"
	"time"
)

type Movie struct {
	Id             int64
	Title          string
	ReleaseDate    time.Time
	Runtime        int64
	MPAARating     string
	Description    string
	Image          string
	Genres         []*Genre
	GenresIntArray []int64
	CreatedAt      sql.NullTime
	UpdateAt       sql.NullTime
}
