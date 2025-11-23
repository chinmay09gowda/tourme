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
    const { place } = await req.json();

    if (!place) {
      return new Response(
        JSON.stringify({ error: "Place name is required" }),
        {
          status: 400,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        }
      );
    }

    const nominatimUrl = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(place)}&format=json&limit=1`;
    
    const response = await fetch(nominatimUrl, {
      headers: {
        "User-Agent": "TourMe Tourism App",
      },
    });

    const data = await response.json();

    if (!data || data.length === 0) {
      return new Response(
        JSON.stringify({ error: "Place not found", exists: false }),
        {
          status: 404,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        }
      );
    }

    const location = data[0];

    return new Response(
      JSON.stringify({
        exists: true,
        lat: parseFloat(location.lat),
        lon: parseFloat(location.lon),
        displayName: location.display_name,
      }),
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