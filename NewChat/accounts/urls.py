from django.urls import path
from rest_framework_simplejwt.views import (
    TokenRefreshView,
)

from accounts.views import LoginView, LogoutView, RegisterView, UserDetailView

urlpatterns = [
    path("api/token/", LoginView.as_view(), name="token_obtain_pair"),
    path("api/token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    path("api/logout/", LogoutView.as_view(), name="logout"),
    path("api/register/", RegisterView.as_view(), name="register"),
    path("api/user-details/", UserDetailView.as_view(), name="user-details"),
]
