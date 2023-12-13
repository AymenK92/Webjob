from rest_framework import viewsets, status
from .models import Company, JobAd, Note, Document, Profile, Skill, Language, Education, Experience, Project
from .serializers import CompanySerializer, JobAdSerializer, NoteSerializer, DocumentSerializer,\
    ProfileSerializer, SkillSerializer, LanguageSerializer, EducationSerializer, RegistrationSerializer, \
    ExperienceSerializer, ProjectSerializer
from rest_framework.response import Response
from django.contrib.auth import authenticate, login as django_login, logout
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from django.http import HttpResponse
from rest_framework.decorators import action
import logging
from django.template.loader import get_template
from xhtml2pdf import pisa
import io
from django.core.exceptions import ValidationError


logger = logging.getLogger(__name__)


class CompanyViewSet(viewsets.ModelViewSet):
    queryset = Company.objects.all()
    serializer_class = CompanySerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Company.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            name = serializer.validated_data.get('name')
            if Company.objects.filter(name=name).exists():
                return Response({'error': 'Cette entreprise existe déjà.'}, status=status.HTTP_400_BAD_REQUEST)
            serializer.save(user=self.request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class JobAdViewSet(viewsets.ModelViewSet):
    queryset = JobAd.objects.all()
    serializer_class = JobAdSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return JobAd.objects.filter(company__user=self.request.user)

    def create(self, request, *args, **kwargs):
        logger.info("Création d'une nouvelle annonce d'emploi")
        serializer = self.get_serializer(data=request.data)

        if serializer.is_valid():
            logger.info("Les données de l'annonce sont valides")
            try:
                job_ad = serializer.save()
                logger.info(f"Annonce d'emploi créée avec succès : {job_ad}")
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            except Exception as e:
                logger.error(f"Erreur lors de la création de l'annonce : {e}")
                return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        else:
            logger.warning(f"Les données de l'annonce sont invalides : {serializer.errors}")
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        self.perform_destroy(instance)
        return Response(status=status.HTTP_204_NO_CONTENT)

    @action(detail=True, methods=['patch'], url_path='toggle-favorite')
    def toggle_favorite(self, request, pk=None):
        job_ad = self.get_object()
        job_ad.is_favorite = not job_ad.is_favorite
        job_ad.save()
        serializer = self.get_serializer(job_ad)
        return Response(serializer.data)


class NoteViewSet(viewsets.ModelViewSet):
    queryset = Note.objects.all()
    serializer_class = NoteSerializer
    permission_classes = [IsAuthenticated]


class DocumentViewSet(viewsets.ModelViewSet):
    queryset = Document.objects.all()
    serializer_class = DocumentSerializer
    permission_classes = [IsAuthenticated]


class ProfileViewSet(viewsets.ModelViewSet):
    serializer_class = ProfileSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Profile.objects.filter(user=self.request.user)

    def partial_update(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)


class SkillViewSet(viewsets.ModelViewSet):
    queryset = Skill.objects.all()
    serializer_class = SkillSerializer
    permission_classes = [IsAuthenticated]


class LanguageViewSet(viewsets.ModelViewSet):
    queryset = Language.objects.all()
    serializer_class = LanguageSerializer
    permission_classes = [IsAuthenticated]


class EducationViewSet(viewsets.ModelViewSet):
    queryset = Education.objects.all()
    serializer_class = EducationSerializer
    permission_classes = [IsAuthenticated]


class ExperienceViewSet(viewsets.ModelViewSet):
    queryset = Experience.objects.all()
    serializer_class = ExperienceSerializer
    permission_classes = [IsAuthenticated]


class ProjectViewSet(viewsets.ModelViewSet):
    queryset = Project.objects.all()
    serializer_class = ProjectSerializer
    permission_classes = [IsAuthenticated]


@api_view(['POST'])
@permission_classes([AllowAny])
def login(request):
    username = request.data.get('username')
    password = request.data.get('password')
    user = authenticate(request, username=username, password=password)
    if user is not None:
        django_login(request, user)
        return Response({'detail': 'Login successful.'}, status=status.HTTP_200_OK)
    else:
        return Response({'detail': 'Invalid credentials.'}, status=status.HTTP_401_UNAUTHORIZED)


@api_view(['POST'])
@permission_classes([AllowAny])
def logout_view(request):
    logout(request)
    return HttpResponse("Déconnecté", status=status.HTTP_200_OK)


@api_view(['POST'])
@permission_classes([AllowAny])
def register(request):
    serializer = RegistrationSerializer(data=request.data)
    if serializer.is_valid():
        try:
            user = serializer.save()
            user.first_name = request.data.get('first_name')
            user.last_name = request.data.get('last_name')
            user.full_clean()
            user.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        except ValidationError as e:
            return Response({'errors': e.messages}, status=status.HTTP_400_BAD_REQUEST)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


def generate_pdf(request, job_ad_id):
    # Récupérer l'annonce d'emploi par son ID
    try:
        job_ad = JobAd.objects.get(pk=job_ad_id)
    except JobAd.DoesNotExist:
        return HttpResponse('Annonce d\'emploi introuvable', status=404)

    # Générer le contenu HTML pour le PDF en utilisant un modèle
    template = get_template('job_ad_pdf_template.html')
    context = {'job_ad': job_ad}
    html = template.render(context)

    # Créer le fichier PDF à partir du contenu HTML
    pdf_file = io.BytesIO()
    pdf = pisa.pisaDocument(io.BytesIO(html.encode("UTF-8")), pdf_file)

    if not pdf.err:
        # Le PDF est généré avec succès, le renvoyer en réponse
        pdf_file.seek(0)
        response = HttpResponse(pdf_file.read(), content_type='application/pdf')
        response['Content-Disposition'] = f'attachment; filename="job_ad_{job_ad.id}.pdf"'
        return response
    else:
        # Une erreur s'est produite lors de la génération du PDF
        return HttpResponse('Erreur lors de la génération du PDF', status=500)