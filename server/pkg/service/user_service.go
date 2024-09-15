package service

import (
	"errors"
	"fmt"
	"os"
	"time"

	"github.com/erkindilekci/cinebase/server/pkg/domain"
	"github.com/erkindilekci/cinebase/server/pkg/repository"
	"github.com/erkindilekci/cinebase/server/pkg/service/dto"
	"github.com/golang-jwt/jwt/v5"
	"golang.org/x/crypto/bcrypt"
)

type IUserService interface {
	Login(email, password string) (string, error)
	SignUp(user *dto.UserCreate) error
}

type UserService struct {
	userRepository repository.IUserRepository
}

func NewUserService(userRepository repository.IUserRepository) IUserService {
	return &UserService{userRepository}
}

func (service *UserService) Login(email, password string) (string, error) {
	jwtKey := os.Getenv("JWT_KEY")

	user, err := service.userRepository.GetUserByEmail(email)
	if err != nil {
		return "", errors.New("no user found with the email: " + email)
	}

	matches, err := user.PasswordMatches(password)
	if err != nil || !matches {
		return "", errors.New("invalid password")
	}

	expirationTime := time.Now().Add(24 * time.Hour)
	claims := &domain.Claims{
		Email: user.Email,
		RegisteredClaims: jwt.RegisteredClaims{
			Issuer:    "example.com",
			Audience:  jwt.ClaimStrings{"example.com"},
			Subject:   fmt.Sprint(user.Id),
			ExpiresAt: jwt.NewNumericDate(expirationTime),
			IssuedAt:  jwt.NewNumericDate(time.Now()),
		},
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	tokenString, err := token.SignedString([]byte(jwtKey))
	if err != nil {
		return "", errors.New("error signing the token: " + err.Error())
	}

	return tokenString, nil
}

func (service *UserService) SignUp(userCreate *dto.UserCreate) error {
	err := validateUserCreate(userCreate)
	if err != nil {
		return err
	}

	user := userCreateToUser(userCreate)

	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(user.Password), bcrypt.DefaultCost)
	if err != nil {
		return errors.New("error while creating password hash")
	}

	user.Password = string(hashedPassword)

	return service.userRepository.SignUp(user)
}

func validateUserCreate(u *dto.UserCreate) error {
	if u.Email == "" {
		return errors.New("email can't be empty")
	}
	if u.Password == "" {
		return errors.New("category can't be empty")
	}
	return nil
}

func userCreateToUser(userCreate *dto.UserCreate) *domain.User {
	return &domain.User{
		Email:    userCreate.Email,
		Password: userCreate.Password,
	}
}
