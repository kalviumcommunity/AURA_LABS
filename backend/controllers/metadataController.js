import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const getStates = async (req, res) => {
  try {
    const universitiesPath = path.join(__dirname, '..', '..', 'data', 'universities.json');
    const data = await fs.readFile(universitiesPath, 'utf8');
    const universities = JSON.parse(data);
    const statesSet = new Set();
    for (const uni of universities) {
      if (uni.state) statesSet.add(String(uni.state));
    }
    const states = Array.from(statesSet).sort();
    res.json({ states });
  } catch (err) {
    res.status(500).json({ error: 'Failed to load states list' });
  }
};

// Helpers (duplicate of logic in recommendationController)
function parseAnnualFees(feeString) {
  if (!feeString) return 0;
  const numbers = feeString.match(/[\d,]+/g);
  if (!numbers) return 0;
  const fee = parseInt(numbers[0].replace(/,/g, ''));
  return fee || 0;
}

function parsePlacementRate(rateString) {
  if (!rateString) return 0;
  const numbers = rateString.match(/\d+/);
  return numbers ? parseInt(numbers[0]) : 0;
}

function parseMedianPackage(packageString) {
  if (!packageString) return 0;
  const numbers = packageString.match(/[\d.]+/g);
  if (!numbers) return 0;
  const value = parseFloat(numbers[0]);
  if (packageString.toLowerCase().includes('l')) {
    return value * 100000; // Convert L to amount
  }
  return value;
}

export const getUniversitiesMeta = async (req, res) => {
  try {
    const universitiesPath = path.join(__dirname, '..', '..', 'data', 'universities.json');
    const data = await fs.readFile(universitiesPath, 'utf8');
    const universities = JSON.parse(data).flat ? JSON.parse(data).flat() : JSON.parse(data);

    const result = [];
    const list = Array.isArray(universities) ? universities : [];
    for (const uni of list) {
      if (!uni || typeof uni !== 'object') continue;
      result.push({
        id: String(uni.id ?? ''),
        name: String(uni.name ?? ''),
        city: uni.city ?? '',
        state: uni.state ?? '',
        annual_fees_raw: uni.annual_fees ?? '',
        placement_rate_raw: uni.placement_rate ?? '',
        median_package_raw: uni.median_package ?? '',
        annual_fees: parseAnnualFees(uni.annual_fees),
        placement_rate: parsePlacementRate(uni.placement_rate),
        median_package: parseMedianPackage(uni.median_package),
        official_page: uni.official_page ?? '',
      });
    }
    res.json({ universities: result });
  } catch (err) {
    res.status(500).json({ error: 'Failed to load universities metadata' });
  }
};


