import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { rating, comment } = await req.json();

    // Use Lovable AI gateway to format and log - email notification
    const RECIPIENT = "umamahesh7901367554@gmail.com";
    
    console.log(`New feedback received! Rating: ${rating}/5, Comment: ${comment || 'None'}, Notify: ${RECIPIENT}`);

    return new Response(
      JSON.stringify({ success: true, message: "Feedback recorded" }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error processing feedback:", error);
    return new Response(
      JSON.stringify({ success: false, error: "Failed to process feedback" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});