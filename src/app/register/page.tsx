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
    const password =
      form.querySelector<HTMLInputElement>('[name="password"]')?.value;
    const confirmation = form.querySelector<HTMLInputElement>(
      '[name="passwordConfirmation"]'
    )?.value;
    if (password !== confirmation) {
      newValidationErrors.passwordMismatch = true;
    }

    // Check terms
    const terms =
      form.querySelector<HTMLInputElement>('[name="terms"]')?.checked;
    if (!terms) {
      newValidationErrors.terms = true;
    }

    setValidationErrors(newValidationErrors);

    if (Object.keys(newValidationErrors).length === 0 && form.checkValidity()) {
      try {
        setSubmitting(true);

        const formData = new FormData(form);
        const userInfo = {
          firstName: formData.get("firstName"),
          lastName: formData.get("lastName"),
          email: formData.get("email"),
          phoneNumber: formData.get("phoneNumber"),
          bio: formData.get("bio"),
          gender: formData.get("gender"),
        };

        // Save user info to localStorage
        localStorage.setItem("userInfo", JSON.stringify(userInfo));

        // Handle profile picture if needed
        if (profilePicture) {
          const reader = new FileReader();
          reader.onloadend = () => {
            const userInfoWithPicture = {
              ...userInfo,
              profilePicture: reader.result,
            };
            localStorage.setItem(
              "userInfo",
              JSON.stringify(userInfoWithPicture)
            );
          };
          reader.readAsDataURL(profilePicture);
        }

        const response = await fetch("/api/setup-test-user", {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          throw new Error("Registration failed");
        }

        setFormSubmitted(true);
        router.push("/dashboard");
      } catch (error) {
        console.error("Registration error:", error);
        setValidationErrors({ submitError: true });
      } finally {
        setSubmitting(false);
      }
    } else {
      form.reportValidity();
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
              accept="image/*"
              leftSection={<IconUpload size={14} />}
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
                  <span data-test="password-mismatch-error">
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

            <Textarea
              label="Address"
              placeholder="Enter your address"
              name="address"
              required
              minRows={3}
              data-test="address"
            />

            <Radio.Group label="Gender" name="gender" required>
              <Group mt="xs">
                <Radio value="male" label="Male" data-test="gender-male" />
                <Radio
                  value="female"
                  label="Female"
                  data-test="gender-female"
                />
              </Group>
            </Radio.Group>

            <Checkbox
              label={
                <div>
                  <Text fw={500}>Newsletter</Text>
                  <Text size="sm" c="dimmed">
                    Receive updates about our latest products and offers
                  </Text>
                </div>
              }
              name="newsletter"
              data-test="newsletter"
            />

            <Checkbox
              label="I accept the terms and conditions"
              name="terms"
              required
              error={
                validationErrors.terms && (
                  <span data-test="terms-validation-error">
                    You must accept the terms and conditions
                  </span>
                )
              }
              data-test="terms-and-conditions"
            />

            <Button
              type="submit"
              fullWidth
              mt="xl"
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
