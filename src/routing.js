export function buildRouting(servers) {

    const selector = servers.map(server => server.tag);

    return {

        domainStrategy: "IPIfNonMatch",

        domainMatcher: "hybrid",

        balancers: [

            buildAutoBalancer(selector)

        ],

        rules: [

            ...buildDNSRules(),

            ...buildPrivateRules(),

            ...buildRussiaRules(),

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

                maxRTT:"1500ms",

                tolerance:50

            }

        }

    };

}

function buildDNSRules(){

    return [

        {

            inboundTag:["dns-in"],

            outboundTag:"direct",

            type:"field"

        }

    ];

}

function buildPrivateRules(){

    return [

        {

            ip:[

                "geoip:private"

            ],

            outboundTag:"direct",

            type:"field"

        },

        {

            ip:[

                "224.0.0.0/4",

                "255.255.255.255/32"

            ],

            outboundTag:"direct",

            type:"field"

        }

    ];

}

function buildRussiaRules(){

    return [

        {

            domain:[

                "geosite:category-ru"

            ],

            outboundTag:"direct",

            type:"field"

        },

        {

            domain:[

                "geosite:ru"
            ],

            outboundTag:"direct",

            type:"field"

        },

        {

            ip:[

                "geoip:ru"
            ],

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
