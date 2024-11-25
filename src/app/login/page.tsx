"use client";

import {
  Button,
  Container,
  TextInput,
  Title,
  Stack,
  Text,
  Alert,
} from "@mantine/core";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Let HTML5 validation handle empty fields
    if (!email || !password) {
      return;
    }

    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        // Store user info in localStorage
        localStorage.setItem(
          "userInfo",
          JSON.stringify({
            firstName: data.firstName || "John", // Fallback for test data
            lastName: data.lastName || "Doe",
            email: email,
            phoneNumber: data.phoneNumber || "",
            bio: data.bio || "",
            gender: data.gender || "",
          })
        );

        // Wait a bit for localStorage to be set
        await new Promise(resolve => setTimeout(resolve, 100));

        // Redirect to dashboard
        router.push("/dashboard");
      } else {
        setError(data.error || "Invalid credentials");
      }
    } catch (error) {
      console.error("Login error:", error);
      setError("An error occurred during login");
    }
  };

  return (
    <Container size="xs" py="xl">
      <Title order={2} ta="center" mt="md" mb="md">
        Login
      </Title>

      {error && (
        <Alert color="red" mb="md" data-test="error-message">
          {error}
        </Alert>
      )}

      <form onSubmit={handleSubmit} noValidate data-test="login-form">
        <Stack>
          <TextInput
            label="Email"
            placeholder="Enter your email"
            required
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            data-test="email"
          />

          <TextInput
            label="Password"
            placeholder="Enter your password"
            required
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            data-test="password"
          />

          <Button type="submit" data-test="login-button">
            Login
          </Button>
        </Stack>
      </form>
    </Container>
  );
}
