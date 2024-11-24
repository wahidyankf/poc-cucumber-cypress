"use client";

import {
  Container,
  Title,
  Paper,
  Text,
  Avatar,
  Stack,
  Group,
  Badge,
} from "@mantine/core";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface UserInfo {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  bio: string;
  gender: string;
  profilePicture?: string;
}

export default function DashboardPage() {
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const router = useRouter();

  useEffect(() => {
    const userData = localStorage.getItem("userInfo");
    if (!userData) {
      router.push("/login");
      return;
    }
    setUserInfo(JSON.parse(userData));
  }, [router]);

  if (!userInfo) {
    return null;
  }

  return (
    <Container size="sm">
      <Title order={1} ta="center" mt="xl" mb="xl">
        Welcome, {userInfo.firstName}!
      </Title>

      <Paper shadow="sm" p="xl" withBorder>
        <Stack>
          <Group justify="center">
            <Avatar
              src={userInfo.profilePicture}
              size="xl"
              radius="xl"
              alt={`${userInfo.firstName}'s profile picture`}
            />
          </Group>

          <Group justify="center">
            <Badge size="lg" variant="light">
              {userInfo.gender}
            </Badge>
          </Group>

          <Group>
            <Text fw={500}>Name:</Text>
            <Text>
              {userInfo.firstName} {userInfo.lastName}
            </Text>
          </Group>

          <Group>
            <Text fw={500}>Email:</Text>
            <Text>{userInfo.email}</Text>
          </Group>

          <Group>
            <Text fw={500}>Phone:</Text>
            <Text>{userInfo.phoneNumber}</Text>
          </Group>

          {userInfo.bio && (
            <>
              <Text fw={500}>Bio:</Text>
              <Text>{userInfo.bio}</Text>
            </>
          )}
        </Stack>
      </Paper>
    </Container>
  );
}
