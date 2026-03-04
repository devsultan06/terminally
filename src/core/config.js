import Conf from "conf";
import dotenv from "dotenv";

dotenv.config();

const schema = {
  apiKey: {
    type: "string",
  },
  safetyMode: {
    type: "boolean",
    default: true,
  },
  explanationMode: {
    type: "boolean",
    default: true,
  },
};

const config = new Conf({
  projectName: "terminally",
  schema,
});

export default config;
