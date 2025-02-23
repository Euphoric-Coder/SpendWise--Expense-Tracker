import { inngest } from "./client";

export const helloWorld = inngest.createFunction(
  { id: "hello-world" },
  {cron: "0 0 * * *"},
  { event: "test/hello.world" },
  async ({ event, step }) => {
    await step.sleep("wait-a-moment", "1s");
    return { message: `Hello ${event.data.email}!` };
  }
);

export const helloWorld1 = inngest.createFunction(
  { id: "hello-world1" },
  { cron: "0 0 * * *" },
  { event: "test/hello.world" },
  async ({ event, step }) => {
    await step.sleep("wait-a-moment", "1s");
    return { message: `Hello ${event.data.email}!` };
  }
);


