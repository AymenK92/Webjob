from django.contrib import admin
from django.contrib.auth.models import User

# Créez une nouvelle classe pour personnaliser l'interface d'administration pour le modèle User
class CustomUserAdmin(admin.ModelAdmin):
    list_display = ['username', 'email', 'first_name', 'last_name', 'is_staff', 'is_superuser']

# Enregistrez le modèle User avec la classe personnalisée
admin.site.unregister(User)
admin.site.register(User, CustomUserAdmin)
