# Low-Level Design (LLD): Project AURA

### 1. Introduction

Project AURA(Advanced University Recommendation Algorithm) is an AI-powered web application designed to provide personalized university recommendations for 12th-grade students. This document outlines the technical design and core logic of the application.

---

### 2. System Architecture

The application follows a standard three-tier architecture, ensuring a separation of concerns and scalability.

* *Frontend (Client):* A responsive web interface built with *React (Next.js)*. It's responsible for capturing user preferences and displaying the final recommendations.
* *Backend (Server):* A *Node.js (Express)* server that handles business logic. It exposes a REST API for the frontend to communicate with. Its primary roles are to process user preferences, execute the AI matching algorithm, and serve data.
* *Database (Persistence):* A simple, file-based database using a **JSON file (universities.json)** will be used for the hackathon prototype. This holds all the university data and can be easily queried by the backend.

---

### 3. Database Schema

For the prototype, we will use a single, well-structured JSON object. The schema for each university will be as follows:

**University Object Schema:**

| Field           | Data Type      | Description                               | Example                       |
| :-------------- | :------------- | :---------------------------------------- | :---------------------------- |
| id            | String         | Unique identifier for the university.     | "uni_001"                   |
| name          | String         | Official name of the university.          | "IIT Bombay"                |
| city          | String         | Primary city of the campus.               | "Mumbai"                    |
| annual_fee    | Number         | Approximate yearly tuition fee in INR.    | 225000                      |
| website_url   | String         | Link to the university's official site.   | "https://iitb.ac.in"        |
| study_modes   | Array<String>  | Supported modes of study.                 | ["Regular", "Hybrid"]       |
| programs      | Array<String>  | Academic fields offered.                  | ["Tech & Programming"]      |
| career_outcomes| Array<String>  | Potential career paths.                   | ["Software Developer"]      |
| scores        | Object         | Key metrics rated out of 10.              | {"placement": 9.8, ...}     |

---

### 4. Core API Endpoint

The primary communication channel between the frontend and backend is the recommendation API.

*Endpoint:* POST /api/recommendations

* *Description:* Takes user preferences as input and returns a ranked list of matching universities.
* *Request Body (JSON):*
    json
    {
      "locations": ["Bangalore", "Pune"],
      "budget": 200000,
      "studyMode": "Regular",
      "interests": ["Technology & Programming"],
      "aspirations": ["Software Developer"],
      "factors": ["placement", "campus_life"]
    }
    
* *Success Response (200 OK):*
    json
    [
      {
        "id": "uni_014",
        "name": "Vellore Institute of Technology, Vellore",
        "matchScore": 92,
        "...other university data"
      }
    ]
    

---

### 5. AI Recommendation Logic

The "AI" is a deterministic algorithm executed on the backend that performs a two-step process: *Filtering* and *Scoring*.

*Step 1: Filtering (Hard Constraints)*
The backend first creates a candidate pool of universities by applying non-negotiable filters based on the user's input:
1.  *Location:* Keep only universities where university.city is in the user's locations list.
2.  *Budget:* Keep only universities where university.annual_fee is less than or equal to the user's budget.
3.  *Study Mode:* Keep only universities where university.study_modes includes the user's studyMode.

*Step 2: Scoring & Ranking (Soft Constraints)*
For the remaining universities, a matchScore is calculated to determine the best fit.
1.  *Interest Score:* A score is awarded based on the number of overlapping items between the user's interests and the university's programs.
2.  *Aspiration Score:* A similar score is calculated for aspirations and career_outcomes.
3.  *Factors Score:* This is the most heavily weighted component. A score is calculated based on the university's ratings for the factors the user deemed most important.
    * Example Formula: If a user prioritizes placement and campus_life:
        factorScore = (university.scores.placement * 0.6) + (university.scores.campus_life * 0.4)
4.  *Final Score:* The scores are combined into a final percentage. The list is then sorted in descending order of matchScore and the top results are returned to the user.
 is an AI-powered web application designed to provide personalized university recommendations for 12th-grade students. This document outlines the technical design and core logic of the application.

---

### 2. System Architecture

The application follows a standard three-tier architecture, ensuring a separation of concerns and scalability.

* *Frontend (Client):* A responsive web interface built with *React (Next.js)*. It's responsible for capturing user preferences and displaying the final recommendations.
* *Backend (Server):* A *Node.js (Express)* server that handles business logic. It exposes a REST API for the frontend to communicate with. Its primary roles are to process user preferences, execute the AI matching algorithm, and serve data.
* *Database (Persistence):* A simple, file-based database using a **JSON file (universities.json)** will be used for the hackathon prototype. This holds all the university data and can be easily queried by the backend.

---

### 3. Database Schema

For the prototype, we will use a single, well-structured JSON object. The schema for each university will be as follows:

**University Object Schema:**

| Field           | Data Type      | Description                               | Example                       |
| :-------------- | :------------- | :---------------------------------------- | :---------------------------- |
| id            | String         | Unique identifier for the university.     | "uni_001"                   |
| name          | String         | Official name of the university.          | "IIT Bombay"                |
| city          | String         | Primary city of the campus.               | "Mumbai"                    |
| annual_fee    | Number         | Approximate yearly tuition fee in INR.    | 225000                      |
| website_url   | String         | Link to the university's official site.   | "https://iitb.ac.in"        |
| study_modes   | Array<String>  | Supported modes of study.                 | ["Regular", "Hybrid"]       |
| programs      | Array<String>  | Academic fields offered.                  | ["Tech & Programming"]      |
| career_outcomes| Array<String>  | Potential career paths.                   | ["Software Developer"]      |
| scores        | Object         | Key metrics rated out of 10.              | {"placement": 9.8, ...}     |

---

### 4. Core API Endpoint

The primary communication channel between the frontend and backend is the recommendation API.

*Endpoint:* POST /api/recommendations

* *Description:* Takes user preferences as input and returns a ranked list of matching universities.
* *Request Body (JSON):*
    json
    {
      "locations": ["Bangalore", "Pune"],
      "budget": 200000,
      "studyMode": "Regular",
      "interests": ["Technology & Programming"],
      "aspirations": ["Software Developer"],
      "factors": ["placement", "campus_life"]
    }
    
* *Success Response (200 OK):*
    json
    [
      {
        "id": "uni_014",
        "name": "Vellore Institute of Technology, Vellore",
        "matchScore": 92,
        "...other university data"
      }
    ]
    

---

### 5. AI Recommendation Logic

The "AI" is a deterministic algorithm executed on the backend that performs a two-step process: *Filtering* and *Scoring*.

*Step 1: Filtering (Hard Constraints)*
The backend first creates a candidate pool of universities by applying non-negotiable filters based on the user's input:
1.  *Location:* Keep only universities where university.city is in the user's locations list.
2.  *Budget:* Keep only universities where university.annual_fee is less than or equal to the user's budget.
3.  *Study Mode:* Keep only universities where university.study_modes includes the user's studyMode.

*Step 2: Scoring & Ranking (Soft Constraints)*
For the remaining universities, a matchScore is calculated to determine the best fit.
1.  *Interest Score:* A score is awarded based on the number of overlapping items between the user's interests and the university's programs.
2.  *Aspiration Score:* A similar score is calculated for aspirations and career_outcomes.
3.  *Factors Score:* This is the most heavily weighted component. A score is calculated based on the university's ratings for the factors the user deemed most important.
    * Example Formula: If a user prioritizes placement and campus_life:
        factorScore = (university.scores.placement * 0.6) + (university.scores.campus_life * 0.4)
4.  *Final Score:* The scores are combined into a final percentage. The list is then sorted in descending order of matchScore and the top results are returned to the user.