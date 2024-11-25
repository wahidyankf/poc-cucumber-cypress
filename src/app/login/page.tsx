"use client";

import {
  Button,
  Container,
  TextInput,
  Title,
  Stack,
  Text,
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

      router.push("/dashboard");
    } else {
      setError(data.error || "Invalid credentials");
    }
  };

  return (
    <Container size="xs" mt="xl">
      <Title order={1} ta="center" mb="xl">
        Login
      </Title>

      <form onSubmit={handleSubmit}>
        <Stack>
          {error && (
            <Text c="red" ta="center" data-test="validation-error">
              {error}
            </Text>
          )}
          <TextInput
            data-test="email"
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <TextInput
            data-test="password"
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <Button type="submit" data-test="login-button">
            Login
          </Button>
        </Stack>
      </form>
    </Container>
  );
}
