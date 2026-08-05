import fs from "node:fs/promises";

import { buildDNS } from "./src/dns.js";
import { buildInbounds } from "./src/inbounds.js";
import { buildOutbounds } from "./src/outbounds.js";
import { buildRouting } from "./src/routing.js";

async function read(file) {

    return JSON.parse(

        await fs.readFile(file, "utf8")

    );

}

async function main() {

    const branding = await read("./config/branding.json");

    const dns = await read("./config/dns.json");

    const server = await read("./config/servers/nl-01.json");

    const config = {

        log: {

            loglevel: "warning"

        },

        dns: buildDNS(dns),

        inbounds: buildInbounds(),

        outbounds: buildOutbounds([server]),

        routing: buildRouting([server]),

        remarks: branding.title

    };

    await fs.writeFile(

        "./generated.json",

        JSON.stringify(config, null, 2)

    );

    console.log("generated.json created");

}

main().catch(console.error);
