export function buildRouting(servers) {

    const selector = [];

    for (const server of servers) {

        selector.push(server.tag);

    }

    return {

        domainStrategy: "IPIfNonMatch",

        balancers: [

            buildAutoBalancer(selector)

        ],

        rules: [

            ...buildDNSRules(),

            ...buildRussiaRules(),

            ...buildLocalRules(),

            buildDefaultRule()

        ]

    };

}
function buildAutoBalancer(selector){

    return{

        tag:"Auto_Balancer",

        selector,

        strategy:{

            type:"leastLoad",

            settings:{

                expected:selector.length,

                baselines:[

                    "200ms",

                    "500ms"

                ],

                maxRTT:"1500ms",

                tolerance:0

            }

        }

    };

}

function buildRussiaRules(){

    return[

        {

            domain:[

                "domain:.ru",

                "domain:.xn--p1ai"

            ],

            outboundTag:"direct",

            type:"field"

        }

    ];

}

function buildLocalRules(){

    return[

        {

            ip:[

                "10.0.0.0/8",

                "172.16.0.0/12",

                "192.168.0.0/16",

                "169.254.0.0/16",

                "224.0.0.0/4",

                "255.255.255.255/32"

            ],

            outboundTag:"direct",

            type:"field"

        }

    ];

}

function buildDNSRules(){

    return[

        {

            ip:[

                "1.1.1.1"

            ],

            port:443,

            balancerTag:"Auto_Balancer",

            type:"field"

        },

        {

            ip:[

                "8.8.8.8"

            ],

            port:443,

            outboundTag:"direct",

            type:"field"

        }

    ];

}

function buildDefaultRule(){

    return{

        network:"tcp,udp",

        balancerTag:"Auto_Balancer",

        type:"field"

    };

}
