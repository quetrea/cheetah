import { Hono } from "hono";
import { ID, Query } from "node-appwrite";
import { zValidator } from "@hono/zod-validator";
import { deleteCookie, setCookie } from "hono/cookie";
import { createAdminClient } from "@/lib/appwrite";
import {
  loginSchema,
  passwordRecovery,
  signUpSchema,
  updateAccountEmailAndPassword,
  updateAccountName,
  updatePasswordRecovery,
  updatePasswordSchema,
} from "../schemas";
import { AUTH_COOKIE } from "@/features/auth/constants";
import { sessionMiddleware } from "@/lib/session-Middleware";
import { getPlan } from "@/features/plans/utils";
import { DATABASE_ID, PLANS_ID } from "@/config";
import { Plan, PlanType } from "@/features/plans/types";

const app = new Hono()
  .get("/current", sessionMiddleware, async (c) => {
    const user = c.get("user");
    const databases = c.get("databases");
    const plan = await databases.listDocuments<Plan>(DATABASE_ID, PLANS_ID, [
      Query.equal("userId", user.$id),
    ]);

    if (!plan.documents[0]) {
      await databases.createDocument<Plan>(DATABASE_ID, PLANS_ID, ID.unique(), {
        userId: user.$id,
        planType: PlanType.FREE,
        startDate: new Date(),
      });
    }

    const currentPlan = await databases.getDocument<Plan>(
      DATABASE_ID,
      PLANS_ID,
      plan.documents[0].$id
    );

    return c.json({ data: { user: user, plan: currentPlan } });
  })
  .post("/login", zValidator("json", loginSchema), async (c) => {
    const { email, password } = c.req.valid("json");

    const { account } = await createAdminClient();

    const session = await account.createEmailPasswordSession(email, password);

    setCookie(c, AUTH_COOKIE, session.secret, {
      path: "/",
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      maxAge: 60 * 60 * 24 * 30,
    });

    return c.json({ success: true });
  })
  .post("/register", zValidator("json", signUpSchema), async (c) => {
    const { name, email, password } = c.req.valid("json");

    const { account } = await createAdminClient();

    await account.create(ID.unique(), email, password, name);

    const session = await account.createEmailPasswordSession(email, password);

    setCookie(c, AUTH_COOKIE, session.secret, {
      path: "/",
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      maxAge: 60 * 60 * 24 * 30,
    });

    return c.json({ success: true });
  })
  .post("/logout", sessionMiddleware, async (c) => {
    const account = c.get("account");
    deleteCookie(c, AUTH_COOKIE);

    await account.deleteSession("current");

    return c.json({ success: true });
  })
  .patch(
    "/:userId/update-name",
    sessionMiddleware,
    zValidator("form", updateAccountName),
    async (c) => {
      try {
        const account = c.get("account");

        const { name } = c.req.valid("form");

        const result = await account.updateName(name); // İsim güncelleniyor

        return c.json({
          data: {
            name: result.name,
          },
        });
      } catch (error) {
        console.error("Error updating user name:", error);
        return c.json({ error: "Internal Server Error" }, 500);
      }
    }
  )
  .patch(
    "/current/update-email",
    sessionMiddleware,
    zValidator("form", updateAccountEmailAndPassword),
    async (c) => {
      const account = c.get("account");
      const user = c.get("user");

      const { email, password } = c.req.valid("form");

      if (user.email === email) {
        return c.json({ error: "Same emails!" }, 409);
      }

      await account.updateEmail(email, password); // Email güncelleniyor

      return c.json({ data: { email: user.email } });
    }
  )
  .post(
    "/current/password-recovery",
    zValidator("json", passwordRecovery),
    async (c) => {
      const { account } = await createAdminClient();

      const { email, url } = c.req.valid("json");

      try {
        const recoveryUrl =
          url || `${process.env.NEXT_PUBLIC_APP_URL}/account/recovery/`;

        const result = await account.createRecovery(email, recoveryUrl);
        return c.json({ data: result.secret });
      } catch (error) {
        console.error("Password recovery error:", error);
        return c.json({ error: "Failed to create recovery" }, 400);
      }
    }
  )
  .put(
    "/password-update-recovery/:secret",
    zValidator("json", updatePasswordRecovery),
    async (c) => {
      const { account } = await createAdminClient();
      const { secret } = c.req.param();
      const { userId, password } = c.req.valid("json");

      try {
        const result = await account.updateRecovery(userId, secret, password);
        return c.json({ data: result });
      } catch (error) {
        console.error("Password recovery error:", error);
        return c.json(
          {
            error:
              "Failed to update password. The recovery link may have expired.",
          },
          400
        );
      }
    }
  )
  .patch(
    "/current/update-password",
    sessionMiddleware,
    zValidator("form", updatePasswordSchema),
    async (c) => {
      const account = c.get("account");

      const { oldPassword, password } = c.req.valid("form");

      if (oldPassword === password) {
        return c.json(
          { error: "The new password must be unique from the old one!" },
          409
        );
      }

      const result = await account.updatePassword(password, oldPassword);

      return c.json({ data: result.$id });
    }
  );

export default app;
