package request

import "github.com/erkindilekci/cinebase/server/pkg/service/dto"

type LoginRequest struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

type SignUpRequest struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

func (request *SignUpRequest) ToDtoModel() *dto.UserCreate {
	return &dto.UserCreate{
		Email:    request.Email,
		Password: request.Password,
	}
}
