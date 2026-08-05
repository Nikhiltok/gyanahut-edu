import pytest
from django.urls import reverse

pytestmark = pytest.mark.django_db


def send_otp(api_client, phone):
    response = api_client.post(reverse("auth-otp-send"), {"phone": phone})
    assert response.status_code == 200, response.data
    return response.data["data"]["debug_otp"]


def test_register_creates_student_user(api_client):
    otp = send_otp(api_client, "9876543210")
    response = api_client.post(
        reverse("auth-register"),
        {
            "name": "Rahul Kumar",
            "email": "rahul@test.com",
            "phone": "9876543210",
            "otp_code": otp,
            "password": "StrongPass123!",
        },
    )
    assert response.status_code == 201, response.data
    assert response.data["success"] is True
    assert response.data["data"]["email"] == "rahul@test.com"


def test_register_rejects_invalid_otp(api_client):
    response = api_client.post(
        reverse("auth-register"),
        {
            "name": "Rahul Kumar",
            "email": "rahul2@test.com",
            "phone": "9876543211",
            "otp_code": "000000",
            "password": "StrongPass123!",
        },
    )
    assert response.status_code == 400
    assert "otp_code" in response.data["errors"]


def test_register_rejects_duplicate_email(api_client, student_user):
    otp = send_otp(api_client, "9876543212")
    response = api_client.post(
        reverse("auth-register"),
        {"name": "Dup", "email": student_user.email, "phone": "9876543212", "otp_code": otp, "password": "StrongPass123!"},
    )
    assert response.status_code == 400
    assert response.data["success"] is False


def test_login_returns_tokens(api_client, student_user):
    response = api_client.post(
        reverse("auth-login"), {"identifier": student_user.email, "password": "TestPass123!"}
    )
    assert response.status_code == 200
    assert "access_token" in response.data["data"]
    assert "refresh_token" in response.data["data"]


def test_login_with_phone_returns_tokens(api_client, student_user):
    student_user.phone = "9998887770"
    student_user.save(update_fields=["phone"])
    response = api_client.post(
        reverse("auth-login"), {"identifier": "9998887770", "password": "TestPass123!"}
    )
    assert response.status_code == 200
    assert "access_token" in response.data["data"]


def test_login_rejects_wrong_password(api_client, student_user):
    response = api_client.post(reverse("auth-login"), {"identifier": student_user.email, "password": "wrong"})
    assert response.status_code == 401


def test_logout_blacklists_refresh_token(api_client, student_user):
    login = api_client.post(reverse("auth-login"), {"identifier": student_user.email, "password": "TestPass123!"})
    refresh = login.data["data"]["refresh_token"]
    access = login.data["data"]["access_token"]

    api_client.credentials(HTTP_AUTHORIZATION=f"Bearer {access}")
    logout_response = api_client.post(reverse("auth-logout"), {"refresh": refresh})
    assert logout_response.status_code == 200

    refresh_response = api_client.post(reverse("auth-token-refresh"), {"refresh": refresh})
    assert refresh_response.status_code == 401


def test_profile_requires_authentication(api_client):
    response = api_client.get(reverse("user-profile"))
    assert response.status_code == 401


def test_profile_returns_own_data(auth_client, student_user):
    response = auth_client.get(reverse("user-profile"))
    assert response.status_code == 200
    assert response.data["data"]["email"] == student_user.email


def test_email_verification_flow(auth_client, student_user):
    assert student_user.email_verified is False

    send_response = auth_client.post(reverse("user-email-send-otp"))
    assert send_response.status_code == 200, send_response.data
    code = send_response.data["data"]["debug_otp"]

    verify_response = auth_client.post(reverse("user-email-verify"), {"code": code})
    assert verify_response.status_code == 200, verify_response.data
    assert verify_response.data["data"]["email_verified"] is True

    student_user.refresh_from_db()
    assert student_user.email_verified is True


def test_email_verification_rejects_wrong_code(auth_client):
    auth_client.post(reverse("user-email-send-otp"))
    response = auth_client.post(reverse("user-email-verify"), {"code": "000000"})
    assert response.status_code == 400


def test_change_password_succeeds_with_correct_old_password(auth_client, student_user):
    response = auth_client.post(
        reverse("auth-password-change"),
        {"old_password": "TestPass123!", "new_password": "NewStrongPass456!"},
    )
    assert response.status_code == 200, response.data

    student_user.refresh_from_db()
    assert student_user.check_password("NewStrongPass456!") is True
    assert student_user.check_password("TestPass123!") is False


def test_change_password_rejects_wrong_old_password(auth_client):
    response = auth_client.post(
        reverse("auth-password-change"),
        {"old_password": "WrongPass000!", "new_password": "NewStrongPass456!"},
    )
    assert response.status_code == 400
    assert "old_password" in response.data["errors"]


def test_change_password_requires_authentication(api_client):
    response = api_client.post(
        reverse("auth-password-change"),
        {"old_password": "TestPass123!", "new_password": "NewStrongPass456!"},
    )
    assert response.status_code == 401


def test_change_password_enforces_password_validators(auth_client):
    response = auth_client.post(
        reverse("auth-password-change"),
        {"old_password": "TestPass123!", "new_password": "123"},
    )
    assert response.status_code == 400
    assert "new_password" in response.data["errors"]
