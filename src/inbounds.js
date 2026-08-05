export function buildInbounds() {

    return [

        {

            listen: "127.0.0.1",

            port: 10808,

            protocol: "socks",

            settings: {

                auth: "noauth",

                udp: true

            },

            sniffing: {

                enabled: true,

                routeOnly: true,

                metadataOnly: false,

                destOverride: [

                    "http",

                    "tls",

                    "quic"

                ]

            },

            tag: "socks"

        }

    ];

}
