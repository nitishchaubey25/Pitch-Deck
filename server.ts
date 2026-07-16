import express from "express";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI, Type } from "@google/genai";
import { createServer as createViteServer } from "vite";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Route
  app.post("/api/generate", async (req, res) => {
    try {
      const { prompt, customApiKey } = req.body;
      if (!prompt || typeof prompt !== "string") {
        return res.status(400).json({ error: "Prompt is required" });
      }

      // Use custom key if provided by user client-side, otherwise fall back to environment variable
      const apiKey = customApiKey || process.env.GEMINI_API_KEY;

      if (!apiKey) {
        return res.status(400).json({
          error: "No Gemini API Key available. Please configure it in your Secrets or enter a custom key in the application."
        });
      }

      const ai = new GoogleGenAI({
        apiKey: apiKey,
        httpOptions: {
          headers: {
            "User-Agent": "aistudio-build",
          },
        },
      });

      const systemInstruction = `You are an elite Silicon Valley pitch deck consultant.
Generate a structured, professional, and realistic pitch deck for a startup based on the user's prompt.
Do not use generic placeholders like [insert team name] or [insert amount]. Choose a cohesive set of realistic details, metrics, names, and milestones that fit the business model perfectly.
The presentation must contain 7 to 9 slides.
Each slide must fit one of the layout types:
- 'text_only' (simple text with subtitle)
- 'two_column' (text bullets on the left, highlighting key aspects on the right)
- 'metrics_grid' (grid of 3-4 key metrics or KPI boxes, e.g. for market or traction)
- 'chart_line' (line chart showing growth/traction over time)
- 'chart_bar' (bar chart showing comparison or segments, e.g. market sectors or competitors)
- 'competitor_matrix' (competitor feature checklist)
- 'team_grid' (team members with name, role, short bio)
- 'timeline' (milestones or product roadmap timeline)

Include logical, realistic details in every slide. Structure the output as valid JSON.`;

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: `Create a pitch deck for: "${prompt}"`,
        config: {
          systemInstruction,
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              companyName: { type: Type.STRING, description: "Professional name for the company." },
              tagline: { type: Type.STRING, description: "A high-impact hook tagline." },
              slides: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    title: { type: Type.STRING, description: "The slide title." },
                    subtitle: { type: Type.STRING, description: "The slide subtitle or primary takeaway statement." },
                    bullets: {
                      type: Type.ARRAY,
                      items: { type: Type.STRING },
                      description: "3 to 4 detailed bullet points with realistic figures and logical business content."
                    },
                    layoutType: {
                      type: Type.STRING,
                      description: "The visual style: 'text_only', 'two_column', 'metrics_grid', 'chart_line', 'chart_bar', 'competitor_matrix', 'team_grid', 'timeline'"
                    },
                    metrics: {
                      type: Type.ARRAY,
                      items: {
                        type: Type.OBJECT,
                        properties: {
                          label: { type: Type.STRING, description: "e.g., 'TAM', 'CAGR', 'Year 1 Revenue', etc." },
                          value: { type: Type.STRING, description: "e.g., '$12B', '24%', '$1.2M', etc." }
                        },
                        required: ["label", "value"]
                      }
                    },
                    competitors: {
                      type: Type.ARRAY,
                      items: {
                        type: Type.OBJECT,
                        properties: {
                          name: { type: Type.STRING, description: "Competitor name or 'Our Company'." },
                          us: { type: Type.BOOLEAN, description: "True if this represents the current company." },
                          features: {
                            type: Type.ARRAY,
                            items: { type: Type.STRING },
                            description: "Features list they support, e.g., ['Real-time syncing', 'AI analysis']."
                          }
                        },
                        required: ["name", "features"]
                      }
                    },
                    teamMembers: {
                      type: Type.ARRAY,
                      items: {
                        type: Type.OBJECT,
                        properties: {
                          name: { type: Type.STRING },
                          role: { type: Type.STRING },
                          bio: { type: Type.STRING }
                        },
                        required: ["name", "role", "bio"]
                      }
                    }
                  },
                  required: ["title", "subtitle", "bullets", "layoutType"]
                }
              }
            },
            required: ["companyName", "tagline", "slides"]
          }
        }
      });

      if (!response.text) {
        throw new Error("Empty response from Gemini API");
      }

      res.setHeader("Content-Type", "application/json");
      res.send(response.text);
    } catch (error: any) {
      console.error("Gemini Generation Error:", error);
      res.status(500).json({ error: error?.message || "Internal server error during generation" });
    }
  });

  // Serve static assets
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();
