import {Type} from "@google/genai";


export const AgentConfigRespSchema = {
  type: Type.OBJECT,

  properties: {
    status: {
      type: Type.STRING,
      enum: ["needs_clarification", "ready"],
    },

    clarificationQuestions: {
      type: Type.ARRAY,

      items: {
        type: Type.OBJECT,

        properties: {
          id: {
            type: Type.STRING,
          },

          question: {
            type: Type.STRING,
          },

          type: {
            type: Type.STRING,
            enum: [
              "single_select",
              "multi_select",
              "text",
            ],
          },

          options: {
            type: Type.ARRAY,
            items: {
              type: Type.STRING,
            },
          },

          allowCustom: {
            type: Type.BOOLEAN,
          },

          customPlaceholder: {
            type: Type.STRING,
          },
        },

        required: [
          "id",
          "question",
          "type",
        ],
      },
    },

    config: {
      type: Type.OBJECT,

      properties: {
        name: {
          type: Type.STRING,
        },

        description: {
          type: Type.STRING,
        },

        instructions: {
          type: Type.STRING,
        },

        objective: {
          type: Type.STRING,
        },

        tools: {
          type: Type.ARRAY,

          items: {
            type: Type.STRING,
            enum: [
              "google_search",
              "serp_search",
              "browserbase",
              "gmail",
              "slack",
              "google_calendar",
              "notion",
            ],
          },
        },

        skills: {
          type: Type.ARRAY,

          items: {
            type: Type.STRING,
          },

          minItems: 2,
          maxItems: 5,
        },

        schedule: {
          type: Type.OBJECT,

          properties: {
            type: {
              type: Type.STRING,
              enum: ["once", "recurring"],
            },

            frequency: {
              type: Type.STRING,
            },

            time: {
              type: Type.STRING,
            },
          },

          required: [
            "type",
            "frequency",
            "time",
          ],
        },

        outputFormat: {
          type: Type.STRING,
        },
      },

      required: [
        "name",
        "description",
        "instructions",
        "objective",
        "tools",
        "skills",
        "schedule",
        "outputFormat",
      ],
    },
  },

  required: [
    "status",
    "clarificationQuestions",
  ],
};