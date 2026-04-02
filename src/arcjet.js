import arcjet, { slidingWindow } from "@arcjet/node";

const arcjetKey = process.env.ARCJET_KEY;
const arcjetMode = process.env.ARCJET_MODE === 'dryRun' ? 'dryRun' : 'prod';

if (!arcjetKey) {
    throw new Error('ARCJET_KEY is required');
}

export const httpArcjet = arcjetKey ? arcjet({
    key: arcjetKey,
    rules: [
        shield({ mode: arcjetMode }),
        detectBot({ mode: arcjetMode, allow: ["CATEGORY:SEARCH_ENGINE", "CATEGORY:PREVIEW", "CATEGORY:WEB_BROWSER"]}),
        slidingWindow({ mode: arcjetMode, interval: '10s', max: 50 })
    ],
}) : null;

export const wsArcjet = arcjetKey ? 
    arcjet({
        key: arcjetKey,
        rules: [
            sheild({ mode: arcjetMode }),
            detectBot({ mode: arcjetMode, allow: ["CTEGORY:SEARCH_ENGINE", , "CATEGORY:PREVIEW"]}),
            slidingWindow({ mode: arcjetMode, interval: '2s', max: 5 })
        ]
    }) : null;


export function securityMiddleWare() {
    return async (req, res, next) => {
        if(!httpArcjet ) return next()

            try { 
                const decison = await httpArcjet.protect(req);

                if(decison.isDenied()) {
                    if(decison.reason.isRateLimit()){
                        return res.status(429).json({ error: 'Too many requests' })
                    }

                    return res.status(403).json({ error: 'Forbidden' })

                }
            }
            catch (e){
                return res.status(503).json({ error: 'Service Unavaible' })

            }

            next();
    }
}
