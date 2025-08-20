export function mapQuestionnaireToBackendPayload(questionnaireData: any) {
  const parsePercentage = (value: string): number => {
    const num = parseFloat(String(value).replace(/[^\d.]/g, ""));
    return Number.isFinite(num) ? Math.min(Math.max(num, 0), 100) : 0;
  };

  const mapBudgetRangeToAmount = (budgetRange: string): number => {
    switch (budgetRange) {
      case "under-1lakh":
        return 100000;
      case "1-3lakh":
        return 300000;
      case "3-5lakh":
        return 500000;
      case "5-10lakh":
        return 1000000;
      case "above-10lakh":
        return 2000000;
      default:
        return 500000;
    }
  };

  const academic_profile = {
    current_stream:
      questionnaireData?.stream === "science"
        ? "Science"
        : questionnaireData?.stream === "commerce"
        ? "Commerce"
        : questionnaireData?.stream === "arts"
        ? "Arts"
        : "Science",
    "12th_percentage": parsePercentage(questionnaireData?.percentage || "0"),
    "jee mains score": Number(questionnaireData?.jeeMainsScore || 0),
    "jee advanced score": Number(questionnaireData?.jeeAdvancedScore || 0),
    "neet score": Number(questionnaireData?.neetScore || 0),
    "cuet score": Number(questionnaireData?.cuetScore || 0),
    strengths: questionnaireData?.preferredSubjects || [],
    weaknesses: [],
  };

  const preferences = {
    desired_programs:
      Array.isArray(questionnaireData?.interests) && questionnaireData.interests.length > 0
        ? questionnaireData.interests
        : ["Engineering"],
    location_preferences: questionnaireData?.preferredLocation || [],
    college_type: ["Government", "Private"],
    campus_life_importance: "Medium",
  };

  const constraints = {
    locations: questionnaireData?.preferredLocation || [],
    budget:
      typeof questionnaireData?.budgetAmount === "number"
        ? questionnaireData.budgetAmount
        : mapBudgetRangeToAmount(questionnaireData?.budgetRange || "3-5lakh"),
    timeline: "2024 admission",
  };

  const finalPayload = { academic_profile, preferences, constraints };
  console.log("[Backend] Built payload from questionnaire:", finalPayload);
  return finalPayload;
}

export async function getBackendRecommendations(questionnaireData: any) {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "https://aura-labs.onrender.com";
  const payload = mapQuestionnaireToBackendPayload(questionnaireData);
  const token = typeof window !== "undefined" ? localStorage.getItem("futurepath_token") : null;

  console.log("[Backend] Sending payload to /api/recommendations:", payload);
  const response = await fetch(`${baseUrl}/api/recommendations`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const text = await response.text();
    console.error("[Backend] Error response:", response.status, text);
    throw new Error(`Backend error ${response.status}: ${text}`);
  }

  const json = await response.json();
  console.log("[Backend] Received response:", json);
  return json;
}


