import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Gemini API configuration
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent';

// Helper function to parse annual fees from string format
function parseAnnualFees(feeString) {
  if (!feeString) return 0;
  const numbers = feeString.match(/[\d,]+/g);
  if (!numbers) return 0;
  const fee = parseInt(numbers[0].replace(/,/g, ''));
  return fee || 0;
}

// Helper function to parse minimum 12th score from string format
function parseMin12thScore(scoreString) {
  if (!scoreString) return 0;
  const numbers = scoreString.match(/\d+/);
  return numbers ? parseInt(numbers[0]) : 0;
}

// Helper function to parse placement rate
function parsePlacementRate(rateString) {
  if (!rateString) return 0;
  const numbers = rateString.match(/\d+/);
  return numbers ? parseInt(numbers[0]) : 0;
}

// Helper function to parse median package
function parseMedianPackage(packageString) {
  if (!packageString) return 0;
  const numbers = packageString.match(/[\d.]+/g);
  if (!numbers) return 0;
  const value = parseFloat(numbers[0]);
  if (packageString.toLowerCase().includes('l')) {
    return value * 100000; // Convert L to actual amount
  }
  return value;
}

// Helper function to parse entrance exam percentile
function parseEntrancePercentile(percentileString) {
  if (!percentileString) return 0;
  const numbers = percentileString.match(/\d+/);
  return numbers ? parseInt(numbers[0]) : 0;
}

// Function to check if student meets entrance exam requirements
function meetsEntranceRequirements(university, academicProfile) {
  const jeeMainsScore = academicProfile['jee mains score'] || 0;
  const jeeAdvancedScore = academicProfile['jee advanced score'] || 0;
  
  // Check if university requires specific entrance exams
  if (!university.exams_accepted || !university.min_percentile_required) {
    return true; // If no specific requirements, allow it
  }
  
  const examsAccepted = university.exams_accepted.map(exam => exam.toLowerCase());
  const minPercentile = parseEntrancePercentile(university.min_percentile_required);
  
  // IITs require JEE Advanced with high percentile
  if (examsAccepted.some(exam => exam.includes('jee advanced'))) {
    if (jeeAdvancedScore === 0) return false; // No JEE Advanced score
    return jeeAdvancedScore >= minPercentile;
  }
  
  // NITs and other colleges require JEE Mains with decent percentile
  if (examsAccepted.some(exam => exam.includes('jee main') || exam.includes('jee mains'))) {
    if (jeeMainsScore === 0) return false; // No JEE Mains score
    return jeeMainsScore >= minPercentile;
  }
  
  // For other exams (NEET, CUET, etc.), check if student has scores
  if (examsAccepted.some(exam => exam.includes('neet'))) {
    const neetScore = academicProfile['neet score'] || 0;
    if (neetScore === 0) return false;
    return neetScore >= minPercentile;
  }
  
  if (examsAccepted.some(exam => exam.includes('cuet'))) {
    const cuetScore = academicProfile['cuet score'] || 0;
    if (cuetScore === 0) return false;
    return cuetScore >= minPercentile;
  }
  
  // For other exams, assume student can take them
  return true;
}

export const getRecommendations = async (req, res) => {
  try {
    // Check if Gemini API key is configured
    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({
        error: "Gemini API key not configured. Please set GEMINI_API_KEY environment variable."
      });
    }

    // Read and parse the universities.json file
    const universitiesPath = path.join(__dirname, '..', 'data', 'universities.json');
    const universitiesData = await fs.readFile(universitiesPath, 'utf8');
    const universities = JSON.parse(universitiesData);

    // Get user profile from request body
    const { 
      academic_profile,
      preferences,
      constraints
    } = req.body;

    // Validate required fields
    if (!academic_profile || !preferences || !constraints) {
      return res.status(400).json({
        error: "Missing required fields: academic_profile, preferences, constraints"
      });
    }

    // Step 1: Initial Filtering - Create candidate pool based on hard constraints
    const candidatePool = universities.filter(university => {
      if (!university.city || !university.annual_fees || !university.min_12th_score_required) {
        return false;
      }

      const annualFee = parseAnnualFees(university.annual_fees);
      const minScore = parseMin12thScore(university.min_12th_score_required);

      // Support both city and state location matching
      const locationMatch = constraints.locations.some(location => 
        location.toLowerCase() === university.city.toLowerCase() || 
        location.toLowerCase() === university.state.toLowerCase()
      );
      
      const budgetMatch = annualFee <= constraints.budget;
      const percentageMatch = minScore <= academic_profile['12th_percentage'];
      
      // CRITICAL: Check if student meets entrance exam requirements
      const entranceMatch = meetsEntranceRequirements(university, academic_profile);

      return locationMatch && budgetMatch && percentageMatch && entranceMatch;
    });

    if (candidatePool.length === 0) {
      return res.status(200).json({
        recommendations: [],
        analysis: {
          message: "No universities match your current criteria. Consider broadening your search or improving your academic profile.",
          suggestions: [
            "Increase your budget range",
            "Consider more locations (cities or states)",
            "Focus on improving your 12th percentage",
            "Improve your entrance exam scores (JEE Mains/Advanced, NEET, CUET)"
          ]
        }
      });
    }

    // Step 2: Multi-dimensional College Analysis with Gemini
    const aiAnalysis = await getComprehensiveCollegeAnalysis(
      candidatePool, 
      academic_profile, 
      preferences, 
      constraints
    );

    if (!aiAnalysis) {
      return res.status(500).json({
        error: "Failed to get AI analysis from Gemini API"
      });
    }

    // Step 3: Build comprehensive response
    const finalResponse = {
      recommendations: aiAnalysis.recommendations,
      admission_analysis: aiAnalysis.admission_analysis,
      college_comparison: aiAnalysis.college_comparison,
      application_strategy: aiAnalysis.application_strategy,
      financial_analysis: aiAnalysis.financial_analysis,
      next_steps: aiAnalysis.next_steps
    };

    res.status(200).json(finalResponse);

  } catch (error) {
    console.error('Recommendation error:', error);
    
    if (error.code === 'ENOENT') {
      return res.status(500).json({
        error: "Universities data file not found. Please ensure data/universities.json exists."
      });
    }
    
    if (error instanceof SyntaxError) {
      return res.status(500).json({
        error: "Invalid universities data format. Please check the universities.json file."
      });
    }
    
    res.status(500).json({
      error: "Internal server error while processing recommendations"
    });
  }
};

// Function to get comprehensive college analysis
async function getComprehensiveCollegeAnalysis(candidatePool, academicProfile, preferences, constraints) {
  try {
    const prompt = constructCollegeAnalysisPrompt(candidatePool, academicProfile, preferences, constraints);
    
    const response = await fetch(`${GEMINI_API_URL}?key=${process.env.GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }],
        generationConfig: {
          temperature: 0.3,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 4096,
        }
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Gemini API error:', response.status, errorText);
      throw new Error(`Gemini API error: ${response.status}`);
    }

    const data = await response.json();
    const generatedText = data.candidates[0].content.parts[0].text;
    const cleanedText = cleanGeminiResponse(generatedText);
    
    try {
      const aiAnalysis = JSON.parse(cleanedText);
      
      // Validate the response structure
      if (!aiAnalysis.recommendations || !Array.isArray(aiAnalysis.recommendations)) {
        throw new Error('Invalid AI analysis structure');
      }
      
      return aiAnalysis;
      
    } catch (parseError) {
      console.error('Failed to parse Gemini response as JSON:', parseError);
      console.error('Cleaned response:', cleanedText);
      throw new Error('Invalid JSON response from Gemini API');
    }

  } catch (error) {
    console.error('Gemini API call failed:', error);
    return null;
  }
}

// Function to clean Gemini response
function cleanGeminiResponse(text) {
  let cleaned = text.replace(/```json\s*/g, '').replace(/```\s*$/g, '');
  cleaned = cleaned.trim();
  
  const jsonStart = cleaned.indexOf('{');
  const jsonEnd = cleaned.lastIndexOf('}');
  
  if (jsonStart !== -1 && jsonEnd !== -1 && jsonEnd > jsonStart) {
    cleaned = cleaned.substring(jsonStart, jsonEnd + 1);
  }
  
  return cleaned;
}

// Function to construct college analysis prompt
function constructCollegeAnalysisPrompt(candidatePool, academicProfile, preferences, constraints) {
  const universitiesData = candidatePool.map(uni => ({
    id: uni.id,
    name: uni.name,
    city: uni.city,
    state: uni.state,
    programs_offered: uni.programs_offered,
    annual_fees: uni.annual_fees,
    placement_rate: uni.placement_rate,
    median_package: uni.median_package,
    min_12th_score_required: uni.min_12th_score_required,
    exams_accepted: uni.exams_accepted,
    min_percentile_required: uni.min_percentile_required,
    scores: uni.scores
  }));

  return `You are an expert university admissions specialist and college counselor. Your job is to help students find the BEST COLLEGES based on their academic profile and preferences.

IMPORTANT: You MUST provide MULTIPLE college recommendations (at least 5-8 colleges) so students have choices to compare and decide from. Do NOT give just one recommendation.

STUDENT PROFILE:
Academic Profile: ${JSON.stringify(academicProfile, null, 2)}
College Preferences: ${JSON.stringify(preferences, null, 2)}
Constraints: ${JSON.stringify(constraints, null, 2)}

AVAILABLE UNIVERSITIES:
${JSON.stringify(universitiesData, null, 2)}

ANALYZE AND PROVIDE MULTIPLE COLLEGE RECOMMENDATIONS:

1. UNIVERSITY RECOMMENDATIONS (ranked by overall college fit):
   - Calculate admission probability based on academic profile vs. requirements
   - Assess program fit with student's academic interests
   - Consider placement rates and salary prospects
   - Factor in location preferences and budget constraints
   - Evaluate overall college quality and reputation
   - MUST provide at least 5-8 different colleges with varying admission probabilities

2. ADMISSION ANALYSIS:
   - Admission probability for each university (High/Medium/Low)
   - Required entrance exams and preparation needed
   - Academic requirements and how student measures up
   - Application deadlines and timeline

3. COLLEGE COMPARISON:
   - Side-by-side analysis of top recommendations
   - Pros and cons of each college
   - Unique strengths of each institution
   - Which college is best for what specific reasons

4. APPLICATION STRATEGY:
   - Categorize as Safety, Target, or Reach schools
   - Application timeline and deadlines
   - Required documents and preparation
   - Backup options if primary choices don't work out

5. FINANCIAL ANALYSIS:
   - Total cost of education (fees + living expenses)
   - ROI calculation based on placement packages
   - Scholarship opportunities available
   - Payment plans and financial aid options

6. NEXT STEPS:
   - Immediate actions student should take
   - Documents to prepare
   - Skills to develop for better admission chances
   - Timeline for applications

RETURN YOUR RESPONSE AS A JSON OBJECT WITH THIS EXACT STRUCTURE:
{
  "recommendations": [
    {
      "id": "university_id",
      "name": "University Name",
      "overall_score": 85,
      "admission_probability": "High/Medium/Low",
      "program_fit": 90,
      "financial_feasibility": 85,
      "placement_prospects": 88,
      "college_quality": 92,
      "why_this_college": "Detailed explanation of why this college is excellent for the student",
      "pros": ["List of college advantages"],
      "cons": ["List of college disadvantages"],
      "application_requirements": "Specific requirements and tips for applying",
      "entrance_exam_requirements": "JEE/NEET/CUET requirements and preparation tips"
    }
  ],
  "admission_analysis": {
    "overall_chances": "Assessment of admission prospects",
    "required_exams": ["List of entrance exams needed"],
    "academic_requirements": "What academic standards need to be met",
    "application_deadlines": "Important dates to remember"
  },
  "college_comparison": {
    "top_choices": ["Best overall colleges"],
    "unique_strengths": "What makes each college special",
    "comparison_matrix": "Side-by-side comparison of key factors"
  },
  "application_strategy": {
    "safety_schools": ["High probability of admission"],
    "target_schools": ["Good match for student profile"],
    "reach_schools": ["Ambitious but worth trying"],
    "timeline": "Application timeline and deadlines"
  },
  "financial_analysis": {
    "total_costs": "Complete cost breakdown",
    "roi_analysis": "Return on investment calculation",
    "scholarship_opportunities": ["Available financial aid"],
    "payment_options": "How to manage the costs"
  },
  "next_steps": {
    "immediate_actions": ["What to do right now"],
    "document_preparation": ["Documents to gather"],
    "skill_development": ["Skills to improve"],
    "application_timeline": "When to apply where"
  }
}

CRITICAL REQUIREMENTS:
1. You MUST provide MULTIPLE college recommendations (5-8 colleges minimum)
2. Include a mix of Safety, Target, and Reach schools
3. Consider entrance exam requirements (JEE/NEET/CUET) in your analysis
4. Focus on finding the BEST COLLEGES for the student based on their academic profile
5. Provide specific, actionable advice for college selection and admission
6. IMPORTANT: Only recommend colleges where the student has a realistic chance of admission based on their entrance exam scores`;
}
