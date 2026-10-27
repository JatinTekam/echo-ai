import {Type} from "@google/genai";


const AgentConfigRespSchema = {
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
              "number",
              "date",
              "time"
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

export const getAgentConfigRespSchema = (availableToolSlugs: string[]) => ({
  ...AgentConfigRespSchema,
  properties: {
    ...AgentConfigRespSchema.properties,
    config: {
      ...AgentConfigRespSchema.properties.config,
      properties: {
        ...AgentConfigRespSchema.properties.config.properties,
        tools: {
          type: Type.ARRAY,
          items: {
            type: Type.STRING,
            ...(availableToolSlugs.length > 0 && { enum: availableToolSlugs }),
          },
        },
      },
    },
  },
});