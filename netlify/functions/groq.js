const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";

exports.handler = async (event, context) => {
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Content-Type": "application/json",
  };

  // Preflight CORS
  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 200, headers, body: "" };
  }

  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: "Method not allowed" }),
    };
  }

  const GROQ_API_KEY = process.env.GROQ_API_KEY;

  if (!GROQ_API_KEY) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: "GROQ_API_KEY not configured" }),
    };
  }

  try {
    const body = JSON.parse(event.body || "{}");
    const action = body.action;
    const data = body.data || {};

    let systemPrompt = "";
    let userPrompt = "";

    switch (action) {
      case "inspiration":
        systemPrompt = `Tu es un expert en culture générale. Tu dois générer une inspiration du jour COMPLÈTE et UNIQUE. Réponds UNIQUEMENT en JSON valide.`;
        userPrompt = `Génère une inspiration du jour avec le format JSON suivant :
{
  "artist": { "style": "nom du mouvement", "name": "nom artiste", "description": "description courte", "palette": ["#hex1", "#hex2", "#hex3", "#hex4", "#hex5"] },
  "personality": { "name": "nom réel", "bio": "biographie courte", "wikiLink": "lien wikipedia français" },
  "book": { "title": "titre", "author": "auteur", "summary": "résumé complet", "context": "contexte historique", "importance": "pourquoi important" },
  "artwork": { "name": "nom oeuvre", "artist": "artiste", "techniques": "techniques utilisées", "meaning": "signification" },
  "album": { "title": "titre album français", "artist": "artiste français", "style": "genre musical", "spotifyLink": "lien spotify" },
  "invention": { "name": "nom invention", "inventor": "inventeur", "date": "date", "impact": "impact sur le monde" },
  "word": { "word": "mot rare", "definition": "définition", "etymology": "étymologie", "example": "exemple" },
  "exercise": "exercice créatif"
}`;
        break;

      case "quiz_code":
        systemPrompt = `Tu es un expert du code de la route. Réponds UNIQUEMENT en JSON.`;
        userPrompt = `Génère 20 questions de quiz au format :
{
  "questions": [
    { "question": "texte", "options": ["A", "B", "C", "D"], "correct": 0 }
  ]
}`;
        break;

      case "quiz_inspi":
        systemPrompt = `Tu es un expert en culture générale. Réponds UNIQUEMENT en JSON.`;
        const inspirations = data.inspirations || [];
        userPrompt = `Voici les inspirations vues :
${JSON.stringify(inspirations)}

Génère 10 questions au format :
{
  "questions": [
    { "question": "texte", "options": ["A","B","C","D"], "correct": 0 }
  ]
}`;
        break;

      case "analyse":
        systemPrompt = `Tu es un coach productivité. Réponds UNIQUEMENT en JSON.`;
        userPrompt = `Analyse cette utilisation :
Catégorie: ${data.category}
Question: ${data.question}
Raison: ${data.reason}

Réponds :
{
  "score": 0-5,
  "analysis": "texte",
  "suggestion": "texte"
}`;
        break;

      default:
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ error: "Action inconnue" }),
        };
    }

    const response = await fetch(GROQ_API_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${GROQ_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama-3.1-70b-versatile",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        temperature: 0.7,
        max_tokens: 4000,
        response_format: { type: "json_object" },
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Groq API error:", errorText);
      return {
        statusCode: response.status,
        headers,
        body: JSON.stringify({ error: "Erreur API Groq" }),
      };
    }

    const dataResult = await response.json();
    const content = dataResult.choices?.[0]?.message?.content ?? "{}";

    return { statusCode: 200, headers, body: content };
  } catch (err) {
    console.error("Function error:", err);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: "Erreur serveur" }),
    };
  }
};
