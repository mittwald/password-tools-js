import { configs } from "@eslint/js";
import { config as configTsSe, configs as configsTsSe } from "typescript-eslint";

export default configTsSe(configs.recommended, configsTsSe.recommended);
