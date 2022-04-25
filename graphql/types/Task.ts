import { objectType, extendType, stringArg, nonNull, intArg } from "nexus";
import { User } from "./user";

export const Task = objectType({
  name: "Task",
  definition(t) {
    t.string("id");
    t.string("title");
    t.string("description");
    t.string("status");
    t.list.field("users", {
      type: User,
      async resolve(parent, _args, ctx) {
        return await ctx.prisma.task
          .findUnique({
            where: {
              id: parent.id,
            },
          })
          .users();
      },
    });
  },
});

export const TaskQuery = extendType({
  type: "Query",
  definition(t) {
    // get all tasks
    t.nonNull.list.field("tasks", {
      type: Task,
      resolve(parent, _args, ctx) {
        return ctx.parent.task.findMany();
      },
    });
    // get task by user id
    t.field("task", {
      type: "Task",
      args: {
        userId: nonNull(stringArg()),
      },
      resolve(_parent, args, ctx) {
        return ctx.prisma.task.findMany({
          where: {
            userId: args.userId,
          },
        });
      },
    });
  },
});
