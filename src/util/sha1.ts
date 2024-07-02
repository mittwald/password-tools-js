import * as sha1 from "js-sha1";

const sha1module = (sha1 as any).default;

export interface JsSha1 {
    (message: string): string;
    update(message: string): string;
    hex(message: string): string;
    array(message: string): number[];
    digest(message: string): number[];
    arrayBuffer(message: string): ArrayBuffer;
}

export default sha1module as JsSha1;
