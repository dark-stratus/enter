export default {

    async fetch(request) {

        try {

            const base = new URL(request.url).origin;

            const [
                branding,
                servers,
                dns,
                routing
            ] = await Promise.all([

                load(base, "branding.json"),
                load(base, "servers.json"),
                load(base, "dns.json"),
                load(base, "routing.json")

            ]);

            const config = buildConfig({

                branding,
                servers,
                dns,
                routing

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
function buildConfig(data){

    return {

        meta:{

            name:data.branding.title

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
