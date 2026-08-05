from rest_framework.pagination import PageNumberPagination


class DefaultPagination(PageNumberPagination):
    """Standard pagination, but callers (e.g. dropdown population in the admin
    UI) can request more per page via ?page_size=, up to max_page_size."""

    page_size = 20
    page_size_query_param = "page_size"
    max_page_size = 500
