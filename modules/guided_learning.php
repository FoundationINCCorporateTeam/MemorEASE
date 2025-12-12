<?php
/**
 * Guided Learning Engine Backend
 * Handles lesson generation and progress tracking
 */

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

$dataFile = '../data/lessons.json';

function loadLessons() {
    global $dataFile;
    if (!file_exists($dataFile)) {
        return ['lessons' => []];
    }
    return json_decode(file_get_contents($dataFile), true);
}

function saveLessons($data) {
    global $dataFile;
    file_put_contents($dataFile, json_encode($data, JSON_PRETTY_PRINT));
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true);
    $action = $input['action'] ?? 'generate';
    
    switch ($action) {
        case 'generate':
            $apiKey = $input['api_key'] ?? '';
            $prompt = $input['prompt'] ?? '';
            
            if (empty($apiKey) || empty($prompt)) {
                echo json_encode(['error' => 'Missing API key or prompt']);
                exit;
            }
            
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
            $lessonData = $input['lesson_data'] ?? null;
            if ($lessonData) {
                $allLessons = loadLessons();
                $allLessons['lessons'][] = $lessonData;
                saveLessons($allLessons);
                echo json_encode(['success' => true]);
            } else {
                echo json_encode(['error' => 'No lesson data provided']);
            }
            break;
            
        default:
            echo json_encode(['error' => 'Invalid action']);
    }
}

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $lessons = loadLessons();
    echo json_encode($lessons);
}
?>
