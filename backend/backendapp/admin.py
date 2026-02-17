from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User  # Import your custom model

class CustomUserAdmin(UserAdmin):
    # This displays the phone number in the user list view
    list_display = ('username', 'email', 'phone', 'is_staff')
    
    # This allows you to edit the phone number in the admin detail view
    fieldsets = UserAdmin.fieldsets + (
        (None, {'fields': ('phone',)}),
    )
    # This adds the phone field to the "Add User" form in Admin
    add_fieldsets = UserAdmin.add_fieldsets + (
        (None, {'fields': ('phone',)}),
    )

admin.site.register(User, CustomUserAdmin)