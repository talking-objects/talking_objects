<?php
// Allowed origins
$allowedOrigins = [
    // 'http://localhost:3000',
    // 'http://116.203.29.185:3000',
    'https://talkingobjectsarchive.org',
    'https://www.talkingobjectsarchive.org',
    'https://staging.talkingobjectsarchive.org',
];

// Get the origin of the request
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';

// Check if the origin is in the allowed list
if (in_array($origin, $allowedOrigins)) {
    $allowedOrigin = $origin;
} else {
    $allowedOrigin = ''; // Block requests from disallowed origins
}

// Handling Preflight Requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    if ($allowedOrigin) {
        header("Access-Control-Allow-Origin: $allowedOrigin");
        header("Access-Control-Allow-Methods: GET, POST, OPTIONS, PATCH, PUT");
        header("Access-Control-Allow-Headers: Content-Type, Authorization, x-language");
        header("Access-Control-Allow-Credentials: true");
    }
    http_response_code(200);
    exit(0);
}

// Setting Headers
if ($allowedOrigin) {
    header("Access-Control-Allow-Origin: $allowedOrigin");
    header("Access-Control-Allow-Methods: GET, POST, OPTIONS, PATCH, PUT");
    header("Access-Control-Allow-Headers: Content-Type, Authorization, x-language");
    header("Access-Control-Allow-Credentials: true");
}

return [
    'debug' => true,
    'api' => [
        'basicAuth' => true,
        'allowInsecure' => true,
        'allow' => [
            'file' => [
                'id',       // Allow access to file ID
                'content',  // Allow access and modification of all file content fields
                'url',      // Allow access to file URL
                'filename', // Allow access to filename
            ],
        ],
      
    ],
    'panel' =>[
        'install' => false
    ],
    'kql' => [
        'auth' => true
    ],
    // 'cache' => [
    //     'pages' => false
    // ],
    'languages' => true,
  
    // 👨‍💻:for panel custom styling
    'panel' => [
        'css' => 'assets/css/custom-panel.css'
    ]
];