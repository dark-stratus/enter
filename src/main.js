import { buildOutbounds } from "./outbounds.js";
import { buildRouting } from "./routing.js";
import { buildDNS } from "./dns.js";
import { buildInbounds } from "./inbounds.js";

export default {

    async fetch(request) {

        try {

            const base = new URL(request.url).origin;

           const [
    branding,
    server,
    dns
] = await Promise.all([

    load(base, "branding.json"),

    load(base, "servers/nl-01.json"),

    load(base, "dns.json")

]);
    load(base, "branding.json"),
    async function loadServer(base, file) {

    const response = await fetch(

        `${base}/config/servers/${file}`

    );

    if (!response.ok) {

        throw new Error(`${file} not found`);

    }

    return response.json();

},
    load(base, "dns.json")

]);

            const config = buildConfig({

    branding,

    servers: [server],

    dns

});

            return new Response(

                JSON.stringify(config, null, 2),

                {

                    headers: buildHeaders(branding)

                }

            );

        }

        catch (e) {

            return new Response(

                e.stack,

                {

                    status:500

                }

            );

        }

    }

}
async function load(base,file){

    const response = await fetch(

        `${base}/config/${file}`

    );

    if(!response.ok){

        throw new Error(

            `${file} not found`

        );

    }

    return response.json();

}
function buildConfig(data) {

    return {

        log: {
            loglevel: "warning"
        },

        dns: buildDNS(data.dns),

        inbounds: buildInbounds(),

        outbounds: buildOutbounds(data.servers),

        routing: buildRouting(data.servers),

        policy: {
            levels: {
                "8": {
                    handshake: 3,
                    connIdle: 300,
                    uplinkOnly: 2,
                    downlinkOnly: 4,
                    bufferSize: 3
                }
            }
        },

        stats: {},

        meta: {
            name: data.branding.title
        }

    };

}
function buildHeaders(branding){

    return{

        "Content-Type":"application/json",

        "Profile-Title":branding.title,

        "Profile-Update-Interval":"1",

        "Announcement":branding.announcement,

        "Support-URL":branding.telegram,

        "Subscription-Userinfo":"upload=0; download=0; total=0; expire=0"

    };

}
