import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import cors from "cors";
import { Resend } from "resend";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(cors());
  app.use(express.json());

  // Email route
  app.post("/api/send-email", async (req, res) => {
    try {
      const apiKey = process.env.RESEND_API_KEY;
      if (!apiKey || apiKey === "re_xxxxxxxxx") {
        console.error("Resend API key missing or invalid.");
        return res.status(500).json({ error: "Resend API key is not configured on the server." });
      }

      const resend = new Resend(apiKey);
      const { to, subject, html } = req.body;

      if (!to || !subject || !html) {
        return res.status(400).json({ error: "Missing required fields (to, subject, html)" });
      }

      const data = await resend.emails.send({
        // The sender email should usually be verified in Resend, e.g. onboarding@resend.dev is allowed for testing
        from: 'onboarding@resend.dev',
        to,
        subject,
        html
      });

      res.status(200).json({ success: true, data });
    } catch (error: any) {
      console.error("Error sending email:", error);
      res.status(500).json({ error: error.message || "Failed to send email" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // Production: serve static files. Express 4 compat.
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
