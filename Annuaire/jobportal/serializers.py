from rest_framework import serializers
from .models import (
    Company, JobAd, Note, Document, Profile,
    Skill, Language, Education, Experience, Project
)
from django.contrib.auth.models import User


# Sérialiseur pour les compétences
class SkillSerializer(serializers.ModelSerializer):
    class Meta:
        model = Skill
        fields = ['id', 'skill']


# Sérialiseur pour les langues
class LanguageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Language
        fields = ['id', 'language']


# Sérialiseur pour les formations
class EducationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Education
        fields = ['id', 'degree', 'university']


# Sérialiseur pour les notes
class NoteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Note
        fields = ['id', 'text']


# Sérialiseur pour les entreprises
class CompanySerializer(serializers.ModelSerializer):
    notes = NoteSerializer(many=True, read_only=True)  # Sérialisation en lecture seule des notes associées

    class Meta:
        model = Company
        fields = ['id', 'name', 'website', 'city', 'email_address', 'physical_address', 'contact_name', 'notes', 'created_at']


# Sérialiseur pour les annonces d'emploi
class JobAdSerializer(serializers.ModelSerializer):
    company = CompanySerializer(read_only=True)  # Sérialisation en lecture seule de l'entreprise associée

    class Meta:
        model = JobAd
        fields = ['id', 'company', 'job_title', 'job_description', 'job_location', 'job_type', 'job_site', 'date_added', 'job_link', 'contact_date', 'is_favorite']


# Sérialiseur pour les documents
class DocumentSerializer(serializers.ModelSerializer):
    company = CompanySerializer(read_only=True)  # Sérialisation en lecture seule de l'entreprise associée

    class Meta:
        model = Document
        fields = ['id', 'company', 'document']


# Sérialiseur pour les utilisateurs
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['first_name', 'last_name', 'email']


# Sérialiseur pour l'enregistrement des utilisateurs
class RegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)  # Champ mot de passe en écriture seule

    class Meta:
        model = User
        fields = ['username', 'email', 'password']

    def create(self, validated_data):
        password = validated_data.pop('password')
        user = User(**validated_data)
        user.set_password(password)
        user.save()
        return user


class ProfileSerializer(serializers.ModelSerializer):
    """
    Sérialiseur pour les profils d'utilisateurs.

    Attributs :
    user -- Instance du sérialiseur User pour le champ user
    """
    user = UserSerializer()

    class Meta:
        model = Profile
        fields = ['id', 'user', 'civility', 'age', 'phone_number', 'city', 'position', 'company', 'skills', 'languages',
                  'educations', 'interests', 'bio', 'birth_date']

    def update(self, instance, validated_data):
        """
        Met à jour une instance de Profile avec les données validées.

        Arguments :
        instance -- L'instance de Profile à mettre à jour
        validated_data -- Les données validées pour mettre à jour l'instance

        Retourne :
        L'instance de Profile mise à jour
        """
        user_data = validated_data.pop('user', None)
        user_instance = instance.user

        if user_data is not None:
            user_instance.first_name = user_data.get('first_name', user_instance.first_name)
            user_instance.last_name = user_data.get('last_name', user_instance.last_name)
            user_instance.email = user_data.get('email', user_instance.email)
            user_instance.save()

        for attr, value in validated_data.items():
            setattr(instance, attr, value)

        instance.save()

        return instance

# Sérialiseur pour les expériences professionnelles
class ExperienceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Experience
        fields = ['id', 'title', 'company', 'location', 'start_date', 'end_date', 'description']


# Sérialiseur pour les projets
class ProjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Project
        fields = ['id', 'title', 'client', 'start_date', 'end_date', 'description']
