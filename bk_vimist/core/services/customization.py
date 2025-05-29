from core.models import Config, Company, User
from django.db import transaction
from django.core.exceptions import ObjectDoesNotExist


# Allow admins to rebrand at any time
def update_branding(
        company: Company,
        updater,
        name: str = None,
        logo = None,
        system_name: str =None,
        primary_color: str = None,
        secondary_color: str = None
) -> tuple[Company, Config]:
    '''
    Atomic update of company branding and configurations.
    Args:
        company: Company to update
        updater: User making changes (for audit trail)
        name: New Company name(optional)
        logo: New company logo(optional)
        primary_color: New p_color(optional)
        secondary_color: New s_color(optional)
    Returns:
        Tuple of updated (Company, Config)
    '''

    with transaction.atomic():
        # update Company fields
        if name:
            company.name = name
        if logo:
            company.logo = logo
        company.updated_by = updater
        company.save()

        # update config fields
        try:
            cfg = company.config
        except ObjectDoesNotExist:
            cfg = Config.objects.create(
                company=company,
                created_by=updater,
                updated_by=updater
            )
        if system_name:
            cfg.system_name = system_name
        if primary_color:
            cfg.primary_color = primary_color
        if secondary_color:
            cfg.secondary_color = secondary_color
        cfg.updated_by=updater
        cfg.save()

    return company, cfg