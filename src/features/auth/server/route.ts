import { Hono } from "hono";
import { ID } from "node-appwrite";
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

const app = new Hono()
  .get("/current", sessionMiddleware, (c) => {
    const user = c.get("user");

    return c.json({ data: user });
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
    sessionMiddleware,
    zValidator("form", passwordRecovery),
    async (c) => {
      const account = c.get("account");

      const { email } = c.req.valid("form");

      const url = `${process.env.NEXT_PUBLIC_APP_URL}/account/recovery/`;

      const result = await account.createRecovery(email, url);

      return c.json({ data: result.secret });
    }
  )
  .put(
    "/:userId/:secret/password-update-recovery",
    sessionMiddleware,
    zValidator("form", updatePasswordRecovery),
    async (c) => {
      const account = c.get("account");

      const { userId, secret } = c.req.param();

      const { password } = c.req.valid("form");

      const result = await account.updateRecovery(userId, secret, password);

      return c.json({ data: result.userId });
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
