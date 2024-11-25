"use client";

import {
  TextInput,
  PasswordInput,
  Checkbox,
  Button,
  Container,
  Paper,
  Title,
  Stack,
  Textarea,
  Radio,
  Group,
  Text,
  Alert,
  FileInput,
} from "@mantine/core";
import { IconUpload } from "@tabler/icons-react";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export default function Register() {
  const [validationErrors, setValidationErrors] = useState<{
    [key: string]: boolean;
  }>({});
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [profilePicture, setProfilePicture] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();

  const validateField = (name: string, value: string) => {
    const newValidationErrors = { ...validationErrors };

    switch (name) {
      case "phoneNumber":
        if (!/^[0-9]{10,}$/.test(value)) {
          newValidationErrors.phone = true;
        } else {
          delete newValidationErrors.phone;
        }
        break;
      case "email":
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          newValidationErrors.email = true;
        } else {
          delete newValidationErrors.email;
        }
        break;
      case "passwordConfirmation":
        const password =
          document.querySelector<HTMLInputElement>('[name="password"]')?.value;
        if (password !== value) {
          newValidationErrors.passwordMismatch = true;
        } else {
          delete newValidationErrors.passwordMismatch;
        }
        break;
    }

    setValidationErrors(newValidationErrors);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const newValidationErrors: { [key: string]: boolean } = {};

    // Check required fields
    const requiredFields = [
      "firstName",
      "lastName",
      "phoneNumber",
      "email",
      "password",
      "passwordConfirmation",
      "address",
    ];
    requiredFields.forEach((field) => {
      const input = form.querySelector<HTMLInputElement>(`[name="${field}"]`);
      if (!input?.value) {
        newValidationErrors[field] = true;
      }
    });

    // Check phone number
    const phoneInput = form.querySelector<HTMLInputElement>(
      '[name="phoneNumber"]'
    );
    if (phoneInput && !/^[0-9]{10,}$/.test(phoneInput.value)) {
      newValidationErrors.phone = true;
    }

    // Check email
    const emailInput = form.querySelector<HTMLInputElement>('[name="email"]');
    if (emailInput && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailInput.value)) {
      newValidationErrors.email = true;
    }

    // Check password match
    const password = form.querySelector<HTMLInputElement>(
      '[name="password"]'
    )?.value;
    const confirmation = form.querySelector<HTMLInputElement>(
      '[name="passwordConfirmation"]'
    )?.value;
    if (password !== confirmation) {
      newValidationErrors.passwordMismatch = true;
    }

    // Check terms
    const terms = form.querySelector<HTMLInputElement>(
      '[name="terms"]'
    )?.checked;
    if (!terms) {
      newValidationErrors.terms = true;
    }

    // Check gender selection
    const gender = form.querySelector<HTMLInputElement>(
      'input[name="gender"]:checked'
    )?.value;
    if (!gender) {
      newValidationErrors.gender = true;
    }

    setValidationErrors(newValidationErrors);

    if (Object.keys(newValidationErrors).length === 0 && form.checkValidity()) {
      try {
        setSubmitting(true);

        const formData = new FormData();

        // Add all form fields to FormData
        formData.append(
          "firstName",
          form.querySelector<HTMLInputElement>('[name="firstName"]')?.value ||
            ""
        );
        formData.append(
          "lastName",
          form.querySelector<HTMLInputElement>('[name="lastName"]')?.value ||
            ""
        );
        formData.append(
          "email",
          form.querySelector<HTMLInputElement>('[name="email"]')?.value || ""
        );
        formData.append(
          "password",
          form.querySelector<HTMLInputElement>('[name="password"]')?.value ||
            ""
        );
        formData.append(
          "passwordConfirmation",
          form.querySelector<HTMLInputElement>(
            '[name="passwordConfirmation"]'
          )?.value || ""
        );
        formData.append(
          "phoneNumber",
          form.querySelector<HTMLInputElement>('[name="phoneNumber"]')?.value ||
            ""
        );
        formData.append(
          "address",
          form.querySelector<HTMLInputElement>('[name="address"]')?.value ||
            ""
        );
        formData.append(
          "gender",
          form.querySelector<HTMLInputElement>('input[name="gender"]:checked')
            ?.value || ""
        );
        formData.append(
          "terms",
          form.querySelector<HTMLInputElement>('[name="terms"]')?.checked
            ? "true"
            : "false"
        );
        formData.append(
          "newsletter",
          form.querySelector<HTMLInputElement>('[name="newsletter"]')?.checked
            ? "true"
            : "false"
        );
        formData.append(
          "bio",
          form.querySelector<HTMLTextAreaElement>('[name="bio"]')?.value || ""
        );

        // Add profile picture if selected
        if (profilePicture) {
          formData.append("profilePicture", profilePicture);
        }

        const response = await fetch("/api/register", {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.error || "Registration failed");
        }

        setFormSubmitted(true);

        // Store user info in localStorage
        const userInfo = {
          email: form.querySelector<HTMLInputElement>('[name="email"]')?.value,
          firstName: form.querySelector<HTMLInputElement>('[name="firstName"]')
            ?.value,
          lastName: form.querySelector<HTMLInputElement>('[name="lastName"]')
            ?.value,
          phoneNumber: form.querySelector<HTMLInputElement>(
            '[name="phoneNumber"]'
          )?.value,
          bio: form.querySelector<HTMLTextAreaElement>('[name="bio"]')?.value,
          gender: form.querySelector<HTMLInputElement>(
            'input[name="gender"]:checked'
          )?.value,
        };
        localStorage.setItem("userInfo", JSON.stringify(userInfo));

        // Wait a bit for localStorage to be set
        await new Promise((resolve) => setTimeout(resolve, 100));

        // Redirect to dashboard
        router.push("/dashboard");
      } catch (error) {
        console.error("Registration error:", error);
        setValidationErrors({ submitError: true });
      } finally {
        setSubmitting(false);
      }
    }
  };

  return (
    <Container size="sm" py="xl">
      <Paper radius="md" p="xl" withBorder>
        <Title order={2} ta="center" mt="md" mb="md">
          Registration Form
        </Title>

        {formSubmitted && (
          <Alert color="green" mb="md" data-test="registration-success">
            Registration successful!
          </Alert>
        )}

        {Object.keys(validationErrors).length > 0 && (
          <Alert color="red" mb="md" data-test="validation-error">
            {validationErrors.submitError
              ? "Registration failed. Please try again."
              : "Please fix the errors in the form"}
          </Alert>
        )}

        <form onSubmit={handleSubmit} noValidate>
          <Stack>
            <FileInput
              label="Profile Picture"
              placeholder="Upload your profile picture"
              accept="image/jpeg,image/png"
              icon={<IconUpload size={14} />}
              value={profilePicture}
              onChange={setProfilePicture}
              data-test="profile-picture"
            />

            <Group grow>
              <TextInput
                label="First Name"
                placeholder="Enter your first name"
                name="firstName"
                required
                data-test="first-name"
              />

              <TextInput
                label="Last Name"
                placeholder="Enter your last name"
                name="lastName"
                required
                data-test="last-name"
              />
            </Group>

            <TextInput
              label="Phone Number"
              placeholder="Enter your phone number"
              name="phoneNumber"
              required
              error={
                validationErrors.phone && (
                  <span data-test="phone-validation-error">
                    Please enter a valid phone number (at least 10 digits)
                  </span>
                )
              }
              data-test="phone-number"
              onChange={(e) =>
                validateField("phoneNumber", e.currentTarget.value)
              }
              onBlur={(e) =>
                validateField("phoneNumber", e.currentTarget.value)
              }
            />

            <TextInput
              label="Email"
              placeholder="Enter your email"
              name="email"
              type="email"
              required
              error={
                validationErrors.email && (
                  <span data-test="email-validation-error">
                    Please enter a valid email address
                  </span>
                )
              }
              data-test="email"
              onChange={(e) => validateField("email", e.currentTarget.value)}
              onBlur={(e) => validateField("email", e.currentTarget.value)}
            />

            <PasswordInput
              label="Password"
              placeholder="Enter your password"
              name="password"
              required
              data-test="password"
            />

            <PasswordInput
              label="Confirm Password"
              placeholder="Confirm your password"
              name="passwordConfirmation"
              required
              error={
                validationErrors.passwordMismatch && (
                  <span data-test="password-validation-error">
                    Passwords do not match
                  </span>
                )
              }
              data-test="password-confirmation"
              onChange={(e) =>
                validateField("passwordConfirmation", e.currentTarget.value)
              }
              onBlur={(e) =>
                validateField("passwordConfirmation", e.currentTarget.value)
              }
            />

            <TextInput
              label="Address"
              placeholder="Enter your address"
              name="address"
              required
              data-test="address"
            />

            <Radio.Group
              name="gender"
              label="Gender"
              required
              data-test="gender-group"
            >
              <Group mt="xs">
                <Radio value="male" label="Male" />
                <Radio value="female" label="Female" />
                <Radio value="other" label="Other" />
              </Group>
            </Radio.Group>

            <Textarea
              label="Bio"
              placeholder="Tell us about yourself"
              name="bio"
              data-test="bio"
            />

            <Checkbox
              label={<Text size="sm">I agree to the terms and conditions</Text>}
              name="terms"
              required
              error={
                validationErrors.terms && (
                  <span data-test="terms-validation-error">
                    You must accept the terms and conditions
                  </span>
                )
              }
              data-test="terms"
            />

            <Checkbox
              label={<Text size="sm">Subscribe to newsletter</Text>}
              name="newsletter"
              data-test="newsletter"
            />

            <Button
              type="submit"
              loading={submitting}
              data-test="register-button"
            >
              Register
            </Button>
          </Stack>
        </form>
      </Paper>
    </Container>
  );
}
