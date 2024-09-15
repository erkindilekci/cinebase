package request

type AddMovieRequest struct {
	Title       string `json:"title"`
	ReleaseDate string `json:"release_date"`
	Runtime     int64  `json:"runtime"`
	MPAARating  string `json:"mpaa_rating"`
	Description string `json:"description"`
	Image       string `json:"image"`
	Genres      []int  `json:"genres"`
}
