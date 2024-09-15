package repository

import (
	"context"
	"errors"
	"fmt"
	"github.com/erkindilekci/cinebase/server/pkg/domain"
	"github.com/jackc/pgx/v4/pgxpool"
	"github.com/labstack/gommon/log"
)

type IUserRepository interface {
	GetUserByEmail(email string) (*domain.User, error)
	SignUp(user *domain.User) error
}

type UserRepository struct {
	dbPool *pgxpool.Pool
}

func NewUserRepository(dbPool *pgxpool.Pool) IUserRepository {
	return &UserRepository{dbPool}
}

func (repository *UserRepository) GetUserByEmail(email string) (*domain.User, error) {
	ctx, cancel := context.WithTimeout(context.Background(), dbTimeout)
	defer cancel()

	var user domain.User

	selectStatement := "SELECT id, email, password FROM cinebase_users WHERE email = $1"
	userRow := repository.dbPool.QueryRow(ctx, selectStatement, email)

	err := userRow.Scan(&user.Id, &user.Email, &user.Password)
	if err != nil && err.Error() == "no rows in result set" {
		return nil, errors.New("error while finding user")
	}

	if err != nil {
		return nil, err
	}

	return &user, nil
}

func (repository *UserRepository) SignUp(user *domain.User) error {
	ctx, cancel := context.WithTimeout(context.Background(), dbTimeout)
	defer cancel()

	insertStatement := "INSERT INTO cinebase_users(email, password) VALUES ($1, $2)"

	addNewUser, err := repository.dbPool.Exec(ctx, insertStatement, user.Email, user.Password)
	if err != nil {
		log.Errorf("error while adding new user: %v", err)
		return err
	}

	log.Info(fmt.Sprint("User added successfully: %v", addNewUser))
	return nil
}
