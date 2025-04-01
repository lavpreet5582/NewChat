from django.contrib import admin
from .models import User  # Import the User model

# Register your models here.


admin.site.site_header = "NewChat Admin"
admin.site.site_title = "NewChat Admin Portal"
admin.site.index_title = "Welcome to NewChat Portal"

from django.contrib.auth.admin import UserAdmin


class CustomUserAdmin(UserAdmin):
    model = User
    list_display = ["username", "email", "is_staff", "is_active"]
    search_fields = ["email", "username"]
    ordering = ["email"]


# Register the CustomUser model with Django's admin
admin.site.register(User, CustomUserAdmin)
