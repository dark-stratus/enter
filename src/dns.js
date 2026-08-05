export function buildDNS(config) {

    return {

        queryStrategy:
            config.queryStrategy || "UseIPv4",

        servers:
            config.servers || [],

        hosts:
            config.hosts || {}

    };

}
