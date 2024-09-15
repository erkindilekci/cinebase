package graph

import (
	"errors"
	"github.com/erkindilekci/cinebase/server/pkg/controller/response"
	"github.com/graphql-go/graphql"
	"strings"
	"time"
)

type Graph struct {
	Movies      []*response.MovieResponse
	QueryString string
	Config      graphql.SchemaConfig
	fields      graphql.Fields
	movieType   *graphql.Object
}

func New(movies []*response.MovieResponse) *Graph {
	var movieType = graphql.NewObject(
		graphql.ObjectConfig{
			Name: "Movie",
			Fields: graphql.Fields{
				"id":           &graphql.Field{Type: graphql.Int},
				"title":        &graphql.Field{Type: graphql.String},
				"release_date": &graphql.Field{Type: graphql.DateTime},
				"runtime":      &graphql.Field{Type: graphql.Int},
				"mpaa_rating":  &graphql.Field{Type: graphql.String},
				"description":  &graphql.Field{Type: graphql.String},
				"image":        &graphql.Field{Type: graphql.String},
				"created_at":   &graphql.Field{Type: graphql.String},
				"updated_at":   &graphql.Field{Type: graphql.DateTime},
			},
		},
	)

	var fields = graphql.Fields{
		"list": &graphql.Field{
			Type:        graphql.NewList(movieType),
			Description: "Get all movies",
			Resolve: func(params graphql.ResolveParams) (interface{}, error) {
				return movies, nil
			},
		},
		"search": &graphql.Field{
			Type:        graphql.NewList(movieType),
			Description: "Search movies by title",
			Args: graphql.FieldConfigArgument{
				"titleContains": &graphql.ArgumentConfig{Type: graphql.String},
			},
			Resolve: func(params graphql.ResolveParams) (interface{}, error) {
				var searchedList []*response.MovieResponse
				searchKey, ok := params.Args["titleContains"].(string)
				if ok {
					for _, movie := range movies {
						if strings.Contains(strings.ToLower(movie.Title), strings.ToLower(searchKey)) {
							searchedList = append(searchedList, movie)
						}
					}
				}
				return searchedList, nil
			},
		},
		"get": &graphql.Field{
			Type:        movieType,
			Description: "Get movie by id",
			Args: graphql.FieldConfigArgument{
				"id": &graphql.ArgumentConfig{Type: graphql.Int},
			},
			Resolve: func(params graphql.ResolveParams) (interface{}, error) {
				id, ok := params.Args["id"].(int)
				if ok {
					for _, movie := range movies {
						if movie.Id == int64(id) {
							return movie, nil
						}
					}
				}
				return nil, nil
			},
		},
	}

	var mutationFields = graphql.Fields{
		"addMovie": &graphql.Field{
			Type:        movieType,
			Description: "Add a new movie",
			Args: graphql.FieldConfigArgument{
				"title":        &graphql.ArgumentConfig{Type: graphql.String},
				"release_date": &graphql.ArgumentConfig{Type: graphql.DateTime},
				"runtime":      &graphql.ArgumentConfig{Type: graphql.Int},
				"mpaa_rating":  &graphql.ArgumentConfig{Type: graphql.String},
				"description":  &graphql.ArgumentConfig{Type: graphql.String},
				"image":        &graphql.ArgumentConfig{Type: graphql.String},
			},
			Resolve: func(params graphql.ResolveParams) (interface{}, error) {
				newMovie := &response.MovieResponse{
					Title:       params.Args["title"].(string),
					ReleaseDate: params.Args["release_date"].(time.Time),
					Runtime:     params.Args["runtime"].(int64),
					MPAARating:  params.Args["mpaa_rating"].(string),
					Description: params.Args["description"].(string),
					Image:       params.Args["image"].(string),
				}
				movies = append(movies, newMovie)
				return newMovie, nil
			},
		},
		"updateMovie": &graphql.Field{
			Type:        movieType,
			Description: "Update an existing movie",
			Args: graphql.FieldConfigArgument{
				"id":           &graphql.ArgumentConfig{Type: graphql.Int},
				"title":        &graphql.ArgumentConfig{Type: graphql.String},
				"release_date": &graphql.ArgumentConfig{Type: graphql.DateTime},
				"runtime":      &graphql.ArgumentConfig{Type: graphql.Int},
				"mpaa_rating":  &graphql.ArgumentConfig{Type: graphql.String},
				"description":  &graphql.ArgumentConfig{Type: graphql.String},
				"image":        &graphql.ArgumentConfig{Type: graphql.String},
			},
			Resolve: func(params graphql.ResolveParams) (interface{}, error) {
				id := params.Args["id"].(int)
				for _, movie := range movies {
					if movie.Id == int64(id) {
						if title, ok := params.Args["title"].(string); ok {
							movie.Title = title
						}
						if releaseDate, ok := params.Args["release_date"].(time.Time); ok {
							movie.ReleaseDate = releaseDate
						}
						if runtime, ok := params.Args["runtime"].(int); ok {
							movie.Runtime = int64(runtime)
						}
						if mpaaRating, ok := params.Args["mpaa_rating"].(string); ok {
							movie.MPAARating = mpaaRating
						}
						if description, ok := params.Args["description"].(string); ok {
							movie.Description = description
						}
						if image, ok := params.Args["image"].(string); ok {
							movie.Image = image
						}
						return movie, nil
					}
				}
				return nil, nil
			},
		},
		"deleteMovie": &graphql.Field{
			Type:        graphql.Boolean,
			Description: "Delete a movie by id",
			Args: graphql.FieldConfigArgument{
				"id": &graphql.ArgumentConfig{Type: graphql.Int},
			},
			Resolve: func(params graphql.ResolveParams) (interface{}, error) {
				id := params.Args["id"].(int)
				for i, movie := range movies {
					if movie.Id == int64(id) {
						movies = append(movies[:i], movies[i+1:]...)
						return true, nil
					}
				}
				return false, nil
			},
		},
	}

	return &Graph{
		Movies:    movies,
		fields:    fields,
		movieType: movieType,
		Config: graphql.SchemaConfig{
			Query:    graphql.NewObject(graphql.ObjectConfig{Name: "Query", Fields: fields}),
			Mutation: graphql.NewObject(graphql.ObjectConfig{Name: "Mutation", Fields: mutationFields}),
		},
	}
}

func (graph *Graph) Query() (*graphql.Result, error) {
	rootQuery := graphql.ObjectConfig{Name: "RootQuery", Fields: graph.fields}
	schemaConfig := graphql.SchemaConfig{Query: graphql.NewObject(rootQuery)}
	schema, err := graphql.NewSchema(schemaConfig)
	if err != nil {
		return nil, err
	}

	params := graphql.Params{Schema: schema, RequestString: graph.QueryString}
	resp := graphql.Do(params)
	if len(resp.Errors) > 0 {
		return nil, errors.New("error executing query")
	}

	return resp, nil
}
