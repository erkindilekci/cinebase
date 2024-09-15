package controller

import (
	"github.com/erkindilekci/cinebase/server/pkg/controller/request"
	"github.com/erkindilekci/cinebase/server/pkg/controller/response"
	"github.com/erkindilekci/cinebase/server/pkg/service"
	"github.com/labstack/echo/v4"
	"net/http"
)

type UserController struct {
	userService service.IUserService
}

func NewUserController(userService service.IUserService) *UserController {
	return &UserController{userService}
}

func (controller *UserController) RegisterUserRoutes(e *echo.Echo) {
	e.POST("/login", controller.Login)
	e.POST("/signup", controller.SignUp)
}

func (controller *UserController) Login(c echo.Context) error {
	var loginRequest request.LoginRequest
	err := c.Bind(&loginRequest)
	if err != nil {
		return c.JSON(http.StatusBadRequest, response.NewErrorResponse("Invalid request: unable to bind the provided data to the user structure"))
	}

	token, err := controller.userService.Login(loginRequest.Email, loginRequest.Password)
	if err != nil {
		return c.JSON(http.StatusUnprocessableEntity, response.NewErrorResponse(err.Error()))
	}

	return c.JSON(http.StatusAccepted, response.NewLoginResponse(token))
}

func (controller *UserController) SignUp(c echo.Context) error {
	var signUpRequest request.SignUpRequest
	err := c.Bind(&signUpRequest)
	if err != nil {
		return c.JSON(http.StatusBadRequest, response.NewErrorResponse("Invalid request: unable to bind the provided data to the user structure"))
	}

	err = controller.userService.SignUp(signUpRequest.ToDtoModel())
	if err != nil {
		return c.JSON(http.StatusUnprocessableEntity, response.NewErrorResponse(err.Error()))
	}

	return c.NoContent(http.StatusCreated)
}
