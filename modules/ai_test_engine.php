<?php
/**
 * AI Test Engine Backend
 * Handles test generation and storage
 */

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Handle preflight
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

$dataFile = '../data/tests.json';

function loadTests() {
    global $dataFile;
    if (!file_exists($dataFile)) {
        return ['tests' => []];
    }
    return json_decode(file_get_contents($dataFile), true);
}

function saveTests($data) {
    global $dataFile;
    file_put_contents($dataFile, json_encode($data, JSON_PRETTY_PRINT));
}

// Handle POST request
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true);
    $action = $input['action'] ?? 'generate';
    
    switch ($action) {
        case 'generate':
            // Generate test via API
            $apiKey = $input['api_key'] ?? '';
            $prompt = $input['prompt'] ?? '';
            
            if (empty($apiKey) || empty($prompt)) {
                echo json_encode(['error' => 'Missing API key or prompt']);
                exit;
            }
            
            // Make API call to Featherless
            $ch = curl_init('https://api.featherless.ai/v1/completions');
            curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
            curl_setopt($ch, CURLOPT_POST, true);
            curl_setopt($ch, CURLOPT_HTTPHEADER, [
                'Authorization: Bearer ' . $apiKey,
                'Content-Type: application/json'
            ]);
            curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode([
                'model' => $input['model'] ?? 'Qwen/Qwen3-8B',
                'prompt' => $prompt,
                'max_tokens' => 2000
            ]));
            
            $response = curl_exec($ch);
            $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
            curl_close($ch);
            
            if ($httpCode === 200) {
                echo $response;
            } else {
                echo json_encode(['error' => 'API request failed', 'code' => $httpCode]);
            }
            break;
            
        case 'save':
            // Save test results
            $testData = $input['test_data'] ?? null;
            if ($testData) {
                $allTests = loadTests();
                $allTests['tests'][] = $testData;
                saveTests($allTests);
                echo json_encode(['success' => true]);
            } else {
                echo json_encode(['error' => 'No test data provided']);
            }
            break;
            
        default:
            echo json_encode(['error' => 'Invalid action']);
    }
}

// Handle GET request
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $tests = loadTests();
    echo json_encode($tests);
}
?>
