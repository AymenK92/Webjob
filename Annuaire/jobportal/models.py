from django.core.validators import EmailValidator
from django.db import models
from django.utils import timezone
from django.contrib.auth.models import User
from django.db.models.signals import post_save
from django.dispatch import receiver


class Company(models.Model):
    """
    Représente une entreprise avec ses informations de base.
    """
    name = models.CharField(max_length=100)
    website = models.URLField(max_length=200)
    city = models.CharField(max_length=50)
    email_address = models.EmailField(max_length=100, default='')
    physical_address = models.TextField()
    contact_name = models.CharField(max_length=100)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name


class JobAd(models.Model):
    """
    Représente une offre d'emploi.
    """
    company = models.ForeignKey(Company, on_delete=models.CASCADE)
    job_title = models.CharField(max_length=100)
    job_description = models.TextField()
    job_location = models.CharField(max_length=100)
    job_type = models.CharField(max_length=50)
    job_site = models.CharField(max_length=100)
    date_added = models.DateTimeField(default=timezone.now)
    job_link = models.URLField()
    contact_date = models.DateTimeField(null=True, blank=True)
    is_favorite = models.BooleanField(default=False)

    def __str__(self):
        return self.job_title


class Note(models.Model):
    """
    Représente une note liée à une entreprise.
    """
    text = models.TextField()
    company = models.ForeignKey(Company, on_delete=models.CASCADE, default=1)

    def __str__(self):
        return self.text[:20]


class Document(models.Model):
    """
    Représente un document lié à une entreprise.
    """
    company = models.ForeignKey(Company, on_delete=models.CASCADE, related_name='documents')
    document = models.FileField(upload_to='documents/', blank=True, null=True)

    def __str__(self):
        return f"{self.document.name} ({self.company.name})"


class Skill(models.Model):
    """
    Représente une compétence.
    """
    skill = models.CharField(max_length=100)

    def __str__(self):
        return self.skill


class Language(models.Model):
    """
    Représente une langue parlée.
    """
    language = models.CharField(max_length=100)

    def __str__(self):
        return self.language


class Education(models.Model):
    """
    Représente une formation ou un diplôme.
    """
    degree = models.CharField(max_length=100)
    university = models.CharField(max_length=100)

    def __str__(self):
        return f"{self.degree} from {self.university}"


class Experience(models.Model):
    """
    Représente une expérience professionnelle.
    """
    title = models.CharField(max_length=100)
    company = models.CharField(max_length=100)
    location = models.CharField(max_length=100)
    start_date = models.DateField()
    end_date = models.DateField(null=True, blank=True)
    description = models.TextField()

    def __str__(self):
        return self.title


class Project(models.Model):
    """
    Représente un projet réalisé.
    """
    title = models.CharField(max_length=100)
    client = models.CharField(max_length=100)
    start_date = models.DateField()
    end_date = models.DateField(null=True, blank=True)
    description = models.TextField()

    def __str__(self):
        return self.title


class Profile(models.Model):
    """
    Représente le profil d'un utilisateur.
    """
    CIVILITY_CHOICES = [
        ('M.', 'M.'),
        ('Mme.', 'Mme.'),
    ]

    user = models.OneToOneField(User, on_delete=models.CASCADE)
    civility = models.CharField(max_length=5, choices=CIVILITY_CHOICES, default='M.')
    age = models.IntegerField(null=True, blank=True)
    phone_number = models.CharField(max_length=15, blank=True)
    city = models.CharField(max_length=100, blank=True)
    position = models.CharField(max_length=100, blank=True)
    company = models.CharField(max_length=100, blank=True)
    skills = models.ManyToManyField(Skill, blank=True)
    languages = models.ManyToManyField(Language, blank=True)
    educations = models.ManyToManyField(Education, blank=True)
    interests = models.TextField(blank=True)
    bio = models.TextField(max_length=500, blank=True)
    birth_date = models.DateField(null=True, blank=True)

    def __str__(self):
        return f"{self.user.username}'s Profile"


@receiver(post_save, sender=User)
def create_user_profile(sender, instance, created, **kwargs):
    """
    Crée un profil utilisateur lors de la création d'un nouvel utilisateur.
    """
    if created:
        Profile.objects.create(user=instance)


@receiver(post_save, sender=User)
def save_user_profile(sender, instance, **kwargs):
    """
    Sauvegarde le profil utilisateur lors de la mise à jour d'un utilisateur existant.
    """
    instance.profile.save()
