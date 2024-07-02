import type { FSJetpack } from "fs-jetpack/types";
import * as jetpack from "fs-jetpack";

const jetpackModule = (jetpack as any).default;

export default jetpackModule as FSJetpack;
