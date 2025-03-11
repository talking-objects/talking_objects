<?php

Kirby::plugin('custom/glossary-validation', [
    'hooks' => [
        'page.update:before' => function (Kirby\Cms\Page $page, array $values, array $strings) {
            // Check if the 'glossary_list' is being updated
            if (isset($values['glossary_list'])) {
                validateGlossaryList($values['glossary_list']);
            }
        }
    ]
]);

// Function to validate the glossary_list field
function validateGlossaryList($glossaryList) {
    // If the glossary_list field is empty or not set, exit
    if (empty($glossaryList)) {
        return;
    }

    // If glossary_list is in YAML format, convert it to an array
    if (is_string($glossaryList)) {
        $glossaryList = yaml($glossaryList); // Parse YAML string into an array if needed
    }

    // Create an array to store word names
    $wordNames = [];

    // Loop through the newly entered glossary_list to check for duplicate words
    foreach ($glossaryList as $item) {
        // Check if the word_name field exists
        if (!isset($item['word_name'])) {
            continue;// If word_name does not exist, skip this item
        }

        $wordName = trim($item['word_name']); // Trim whitespace from the word name
        $lowercaseWordName = strtolower($wordName); // Convert the word to lowercase
        // If the same word (in lowercase) is already in the array, throw an exception to prevent duplicates
        if (in_array($lowercaseWordName, $wordNames)) {
            throw new Exception('The term "' . $wordName . '" already exists (case-insensitive). Each term must be unique.');
        }

        // If there is no duplicate, add the lowercase word to the array
        $wordNames[] = $lowercaseWordName;
    }
}
