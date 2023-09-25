from django.urls import path, include
from rest_framework.routers import DefaultRouter
from jobportal.views import CompanyViewSet, JobAdViewSet, NoteViewSet, LanguageViewSet, SkillViewSet, EducationViewSet, \
    DocumentViewSet, login, register, logout_view,  ProfileViewSet, ExperienceViewSet, ProjectViewSet

router = DefaultRouter()
router.register(r'profiles', ProfileViewSet, basename='profile')
router.register(r'companies', CompanyViewSet)
router.register(r'jobads', JobAdViewSet)
router.register(r'notes', NoteViewSet)
router.register(r'documents', DocumentViewSet)
router.register(r'skills', SkillViewSet)
router.register(r'languages', LanguageViewSet)
router.register(r'educations', EducationViewSet)
router.register(r'experiences', ExperienceViewSet)
router.register(r'projects', ProjectViewSet)

urlpatterns = [
    path('api/', include(router.urls)),
    path('api/login/', login, name='login'),
    path('api/logout/', logout_view, name='logout'),
    path('api/register/', register, name='register'),

]
