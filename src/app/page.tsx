import { Container, Title, Text, Stack, Button } from "@mantine/core";
import Link from "next/link";

export default function Home() {
  return (
    <Container size="sm" py="xl">
      <Stack align="center" gap="lg">
        <Title order={1} ta="center">
          Welcome to Demo Cucumber Cypress
        </Title>

        <Text ta="center" data-test="welcome-message">
          This is a demo application showcasing Cypress with Cucumber
          integration
        </Text>

        <Button
          component={Link}
          href="/register"
          data-test="register-link"
          variant="filled"
          size="lg"
          mt="xl"
        >
          Go to Registration Form
        </Button>
      </Stack>
    </Container>
  );
}
