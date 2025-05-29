from django.utils.deprecation import MiddlewareMixin
from threading import local
_thread_locals = local()

'''
Thread safety: django handles many request concurrently
    - threading.local() ensures request.user is isolated to each request thread
'''
class AuditMiddleware(MiddlewareMixin):
    '''
    Automatically sets audit fields for all model saves
    Avoids leaking data to other requests
    func:
        process_request - stores the current authenticated user
        process_response - clears the user from _thread_locals
    '''
    def process_request(self, request):
        _thread_locals.user = request.user if request.user.is_authenticated else None

    def process_response(self, request, response):
        _thread_locals.user = None
        return response

def get_current_user():
    '''
    Fetches the currently authenticated user
    - use to set the value: 'created_by', 'updated_by'
    '''
    return getattr(_thread_locals, 'user', None)