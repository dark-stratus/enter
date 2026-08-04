export function buildOutbounds(servers) {

    const outbounds = [];

    for (const server of servers) {

        switch (server.protocol) {

            case "vless":

                outbounds.push(buildVLESS(server));

                break;

            case "shadowsocks":

                outbounds.push(buildShadowsocks(server));

                break;

            default:

                throw new Error(
                    `Unknown protocol: ${server.protocol}`
                );

        }

    }

    outbounds.push({

        protocol: "freedom",

        settings: {

            domainStrategy: "UseIP"

        },

        tag: "direct"

    });

    outbounds.push({

        protocol: "blackhole",

        settings: {

            response: {

                type: "http"

            }

        },

        tag: "block"

    });

    return outbounds;

}

function buildVLESS(server){

    return{

        protocol:"vless",

        tag:server.tag,

        settings:{

            vnext:[

                {

                    address:server.address,

                    port:server.port,

                    users:[

                        {

                            id:server.uuid,

                            encryption:"none",

                            flow:server.transport.flow

                        }

                    ]

                }

            ]

        },

        streamSettings:{

            network:server.transport.type,

            security:server.transport.security,

            realitySettings:{

                fingerprint:server.transport.fingerprint,

                publicKey:server.transport.publicKey,

                serverName:server.transport.serverName,

                shortId:server.transport.shortId

            }

        }

    };

}

function buildShadowsocks(server){

    return{

        protocol:"shadowsocks",

        tag:server.tag,

        settings:{

            servers:[

                {

                    address:server.address,

                    port:server.port,

                    method:server.method,

                    password:server.password

                }

            ]

        }

    };

}
