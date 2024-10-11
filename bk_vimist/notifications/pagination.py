"""
Custom pagination for notifications
"""
from rest_framework.pagination import PageNumberPagination
from rest_framework.response import Response


class NotificationsPagination(PageNumberPagination):
    page_size = 10
    page_size_query_param = 'page_size'
    max_page_size = 100

    def get_paginated_response(self, data):
        return Response({
            'meta': {
                'page': self.page.number,
                'page_size': self.page.paginator.per_page,
                'total_pages': self.page.paginator.num_pages,
                'total_objects': self.page.paginator.count
            },
            'Notifications': data
        })