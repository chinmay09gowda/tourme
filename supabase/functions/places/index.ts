import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const { lat, lon } = await req.json();

    if (!lat || !lon) {
      return new Response(
        JSON.stringify({ error: "Latitude and longitude are required" }),
        {
          status: 400,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        }
      );
    }

    const radius = 10000;
    const overpassQuery = `
      [out:json];
      (
        node["tourism"="attraction"](around:${radius},${lat},${lon});
        way["tourism"="attraction"](around:${radius},${lat},${lon});
        node["tourism"="museum"](around:${radius},${lat},${lon});
        way["tourism"="museum"](around:${radius},${lat},${lon});
        node["historic"](around:${radius},${lat},${lon});
        way["historic"](around:${radius},${lat},${lon});
        node["leisure"="park"](around:${radius},${lat},${lon});
        way["leisure"="park"](around:${radius},${lat},${lon});
      );
      out body 20;
    `;

    const response = await fetch("https://overpass-api.de/api/interpreter", {
      method: "POST",
      body: overpassQuery,
    });

    const data = await response.json();

    if (!data || !data.elements) {
      return new Response(
        JSON.stringify({ error: "No places found" }),
        {
          status: 404,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        }
      );
    }

    const places = data.elements
      .filter((element: any) => element.tags && element.tags.name)
      .map((element: any) => ({
        name: element.tags.name,
        type: element.tags.tourism || element.tags.historic || element.tags.leisure || "attraction",
      }))
      .slice(0, 5);

    return new Response(
      JSON.stringify({ places }),
      {
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  }
});