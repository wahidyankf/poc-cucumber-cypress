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
      <Title order={1} ta="center" mt="xl" mb="xl" data-test="dashboard-welcome">
        Welcome, {userInfo.firstName}!
      </Title>

      <Paper shadow="sm" p="xl" withBorder>
        <Stack>
          <Group justify="center">
            <Avatar
              size="xl"
              radius="xl"
              src={userInfo.profilePicture}
              alt={`${userInfo.firstName} ${userInfo.lastName}`}
            />
          </Group>

          <div data-test="profile-info">
            <Group mb="xs">
              <Text fw={500}>Name:</Text>
              <Text>{userInfo.firstName} {userInfo.lastName}</Text>
            </Group>

            <Group mb="xs">
              <Text fw={500}>Email:</Text>
              <Text>{userInfo.email}</Text>
            </Group>

            <Group mb="xs">
              <Text fw={500}>Phone:</Text>
              <Text>{userInfo.phoneNumber}</Text>
            </Group>

            {userInfo.bio && (
              <Group mb="xs">
                <Text fw={500}>Bio:</Text>
                <Text>{userInfo.bio}</Text>
              </Group>
            )}
          </div>

          <Group>
            <Text fw={500}>Gender:</Text>
            <Badge color="blue" data-test="gender-badge">
              {userInfo.gender}
            </Badge>
          </Group>
        </Stack>
      </Paper>
    </Container>
  );
}
